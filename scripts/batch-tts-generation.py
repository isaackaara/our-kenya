#!/usr/bin/env python3
"""
Batch TTS Generation for Our Kenya
Generates audio for all notes using Nvidia Glow-TTS + HiFi-GAN (via Coqui TTS library)
Output: MP3 files at quartz/static/audio/{slug}.mp3

Usage:
  python3 scripts/batch-tts-generation.py                    # all notes
  python3 scripts/batch-tts-generation.py --limit 10         # first 10 only
  python3 scripts/batch-tts-generation.py --force "slug"     # regenerate specific note
  python3 scripts/batch-tts-generation.py --reset            # clear checkpoint, start fresh
"""

import os
import sys
import json
import re
from pathlib import Path
from typing import Optional
import subprocess
import time
from datetime import datetime
import argparse

# Configuration
CONTENT_DIR = Path("content")
AUDIO_OUTPUT_DIR = Path("quartz/static/audio")
LOG_FILE = Path("batch-tts-generation.log")
FAILURE_LOG = Path("batch-tts-failures.log")
CHECKPOINT_FILE = Path(".tts-checkpoint.json")

# TTS Settings
CHECKPOINT_INTERVAL = 20  # Save checkpoint every N files


def log(msg: str, level: str = "INFO"):
    """Log to file and stdout"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    log_msg = f"[{timestamp}] [{level}] {msg}"
    print(log_msg)
    with open(LOG_FILE, "a") as f:
        f.write(f"[{datetime.now().isoformat()}] [{level}] {msg}\n")


def slugify(filepath: Path) -> str:
    """
    Convert a content file path to the audio slug the JS expects.
    The listen.inline.ts does: slug.split("/").pop()!.toLowerCase()
    So we just need the lowercase basename with spaces -> hyphens.
    """
    name = filepath.stem  # e.g. "1963 Independence Election"
    # Quartz converts spaces to hyphens in URLs
    slug = name.replace(" ", "-")
    return slug.lower()


def extract_readable_text(md_content: str) -> Optional[str]:
    """
    Extract readable text from markdown for TTS.
    - Skip YAML front matter
    - Stop at "See Also" or "Sources" sections
    - Clean wikilinks, markdown formatting, HTML tags
    """
    # Remove YAML front matter
    if md_content.startswith("---"):
        parts = md_content.split("---", 2)
        if len(parts) > 2:
            md_content = parts[2]

    # Find cutoff point (See Also / Sources)
    lines = md_content.split("\n")
    cutoff_idx = len(lines)
    for i, line in enumerate(lines):
        if re.match(r"^#+\s*(see also|sources)\s*$", line, re.IGNORECASE):
            cutoff_idx = i
            break

    content = "\n".join(lines[:cutoff_idx])

    # Remove HTML tags (e.g. <a>, <div>, etc.)
    content = re.sub(r"<[^>]+>", "", content)

    # Remove wikilinks but keep text: [[Link|Text]] -> Text, [[Link]] -> Link
    content = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", r"\2", content)
    content = re.sub(r"\[\[([^\]]+)\]\]", r"\1", content)

    # Remove markdown links but keep text: [text](url) -> text
    content = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", content)

    # Remove markdown formatting (bold, italic, code, headers)
    content = re.sub(r"[*_`]", "", content)
    content = re.sub(r"^#+\s*", "", content, flags=re.MULTILINE)

    # Remove horizontal rules
    content = re.sub(r"^-{3,}\s*$", "", content, flags=re.MULTILINE)

    # Clean up whitespace
    content = " ".join(content.split())

    # Minimum length check
    if len(content) < 50:
        return None

    # Skip auto-generated stubs (boilerplate text)
    stub_patterns = [
        "Historical event record:",
        "Historical record of",
        "Historical documentation of",
        "A historical biography of",
        "serving as an important focal point",
        "illuminates how local, regional, and national scales",
    ]
    for pattern in stub_patterns:
        if pattern in content:
            return None

    return content.strip()


def load_checkpoint() -> dict:
    """Load checkpoint to resume from last position"""
    if CHECKPOINT_FILE.exists():
        with open(CHECKPOINT_FILE) as f:
            return json.load(f)
    return {"processed": [], "failed": []}


def save_checkpoint(data: dict):
    """Save checkpoint"""
    with open(CHECKPOINT_FILE, "w") as f:
        json.dump(data, f)


def generate_audio(text: str, output_path: str) -> bool:
    """Generate audio using gTTS (Google Text-to-Speech)"""
    try:
        from gtts import gTTS
        tts = gTTS(text=text, lang="en", slow=False)
        tts.save(output_path)
        return True
    except Exception as e:
        log(f"  Generation error: {e}", "ERROR")
        if os.path.exists(output_path):
            os.remove(output_path)
        return False


def find_all_notes() -> list[Path]:
    """Find all markdown notes in content/, recursively"""
    notes = []
    for md_file in sorted(CONTENT_DIR.rglob("*.md")):
        # Skip special directories and files
        rel = md_file.relative_to(CONTENT_DIR)
        parts = rel.parts

        # Skip explore stubs, trail intros, index-like files
        if len(parts) > 0 and parts[0] in ("explore", "Trails"):
            continue
        # Skip the homepage
        if md_file.name == "index.md":
            continue
        # Skip stats page
        if md_file.name == "stats.md":
            continue

        notes.append(md_file)

    return notes


def main():
    parser = argparse.ArgumentParser(description="Batch TTS generation for Our Kenya")
    parser.add_argument("--limit", type=int, default=0, help="Max notes to process (0 = all)")
    parser.add_argument("--force", type=str, default="", help="Force regenerate a specific slug")
    parser.add_argument("--reset", action="store_true", help="Clear checkpoint and start fresh")
    args = parser.parse_args()

    log("=" * 60)
    log("Batch TTS Generation — gTTS (Google Text-to-Speech)")
    log(f"Output: {AUDIO_OUTPUT_DIR}")
    log("=" * 60)

    os.makedirs(AUDIO_OUTPUT_DIR, exist_ok=True)

    # Handle --reset
    if args.reset and CHECKPOINT_FILE.exists():
        CHECKPOINT_FILE.unlink()
        log("Checkpoint cleared")

    checkpoint = load_checkpoint()
    processed_set = set(checkpoint["processed"])
    failed_set = set(checkpoint["failed"])

    # Find all notes
    all_notes = find_all_notes()
    log(f"Found {len(all_notes)} notes in content/")

    # Handle --force: regenerate a specific slug
    if args.force:
        force_slug = args.force.lower()
        matching = [n for n in all_notes if slugify(n) == force_slug]
        if not matching:
            log(f"No note found matching slug '{force_slug}'", "ERROR")
            sys.exit(1)
        all_notes = matching
        # Remove from checkpoint so it gets reprocessed
        processed_set.discard(force_slug)
        failed_set.discard(force_slug)
        # Delete existing audio
        existing = AUDIO_OUTPUT_DIR / f"{force_slug}.mp3"
        if existing.exists():
            existing.unlink()
            log(f"Deleted existing audio: {existing}")

    # Build work list — when multiple files produce the same slug, keep the largest
    slug_to_note: dict[str, Path] = {}
    for note in all_notes:
        slug = slugify(note)
        if slug not in slug_to_note or note.stat().st_size > slug_to_note[slug].stat().st_size:
            slug_to_note[slug] = note

    work = []
    skipped = 0
    for slug, note in sorted(slug_to_note.items()):
        audio_path = AUDIO_OUTPUT_DIR / f"{slug}.mp3"
        if slug in processed_set or audio_path.exists():
            skipped += 1
            continue
        if slug in failed_set and not args.force:
            skipped += 1
            continue
        work.append((note, slug))

    if args.limit > 0:
        work = work[:args.limit]

    log(f"To generate: {len(work)} | Already done: {skipped}")

    if not work:
        log("Nothing to do!")
        return

    # Process
    generated = 0
    failed = 0
    total_bytes = 0
    start_time = time.time()

    for i, (note, slug) in enumerate(work, 1):
        # Read and extract text
        try:
            content = note.read_text(encoding="utf-8")
        except Exception as e:
            log(f"  Cannot read {note}: {e}", "ERROR")
            failed_set.add(slug)
            failed += 1
            continue

        text = extract_readable_text(content)
        if not text:
            log(f"  [{i}/{len(work)}] {slug} — no readable text, skipping", "WARN")
            failed_set.add(slug)
            failed += 1
            continue

        audio_path = AUDIO_OUTPUT_DIR / f"{slug}.mp3"
        log(f"  [{i}/{len(work)}] {slug} ({len(text)} chars)")

        if generate_audio(text, str(audio_path)):
            size_kb = audio_path.stat().st_size / 1024
            total_bytes += audio_path.stat().st_size
            log(f"  -> {size_kb:.0f} KB")
            processed_set.add(slug)
            generated += 1
        else:
            failed_set.add(slug)
            failed += 1
            with open(FAILURE_LOG, "a") as f:
                f.write(f"{datetime.now().isoformat()} {slug} {note}\n")

        # Checkpoint
        if i % CHECKPOINT_INTERVAL == 0:
            checkpoint["processed"] = list(processed_set)
            checkpoint["failed"] = list(failed_set)
            save_checkpoint(checkpoint)
            elapsed = time.time() - start_time
            rate = generated / elapsed if elapsed > 0 else 0
            remaining = (len(work) - i) / rate if rate > 0 else 0
            log(f"  -- checkpoint {i}/{len(work)} | {rate:.1f}/sec | ~{remaining:.0f}s remaining")

    # Final checkpoint
    checkpoint["processed"] = list(processed_set)
    checkpoint["failed"] = list(failed_set)
    save_checkpoint(checkpoint)

    # Summary
    elapsed = time.time() - start_time
    log("")
    log("=" * 60)
    log(f"DONE in {elapsed:.0f}s")
    log(f"  Generated: {generated}")
    log(f"  Failed:    {failed}")
    log(f"  Total size: {total_bytes / (1024*1024):.1f} MB")
    log("=" * 60)


if __name__ == "__main__":
    main()
