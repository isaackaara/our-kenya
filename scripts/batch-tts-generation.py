#!/usr/bin/env python3
"""
Batch TTS Generation for Our Kenya
Generates audio for notes using Google Cloud TTS (WaveNet/Neural2 voices)
Output: MP3 files at audio-output/{slug}.mp3 (for upload to R2)

Requires: GOOGLE_TTS_API_KEY environment variable (or in .env file)

Usage:
  python3 scripts/batch-tts-generation.py                              # all notes
  python3 scripts/batch-tts-generation.py --limit 10                   # first 10 only
  python3 scripts/batch-tts-generation.py --force "slug"               # regenerate specific note
  python3 scripts/batch-tts-generation.py --reset                      # clear checkpoint, start fresh
  python3 scripts/batch-tts-generation.py --slugs-file top-1000.txt    # only generate for listed slugs
"""

import os
import sys
import json
import re
import base64
from pathlib import Path
from typing import Optional
import time
from datetime import datetime
import argparse
import urllib.request
import urllib.error

# Configuration
CONTENT_DIR = Path("content")
AUDIO_OUTPUT_DIR = Path("audio-output")
LOG_FILE = Path("batch-tts-generation.log")
FAILURE_LOG = Path("batch-tts-failures.log")
CHECKPOINT_FILE = Path(".tts-checkpoint.json")

# Google Cloud TTS settings
TTS_VOICE = "en-US-Neural2-C"  # Female, natural-sounding
TTS_LANGUAGE = "en-US"
MAX_CHUNK_BYTES = 5000  # Google Cloud TTS input limit
CHECKPOINT_INTERVAL = 20  # Save checkpoint every N files


def log(msg: str, level: str = "INFO"):
    """Log to file and stdout"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    log_msg = f"[{timestamp}] [{level}] {msg}"
    print(log_msg)
    with open(LOG_FILE, "a") as f:
        f.write(f"[{datetime.now().isoformat()}] [{level}] {msg}\n")


def get_api_key() -> str:
    """Get Google TTS API key from environment or .env file"""
    key = os.environ.get("GOOGLE_TTS_API_KEY")
    if key:
        return key

    # Try .dev.vars (Cloudflare local dev secrets)
    dev_vars = Path(".dev.vars")
    if dev_vars.exists():
        for line in dev_vars.read_text().splitlines():
            if line.startswith("GOOGLE_TTS_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"')

    log("GOOGLE_TTS_API_KEY not found in environment or .dev.vars", "ERROR")
    log("Set it with: export GOOGLE_TTS_API_KEY=your-key", "ERROR")
    sys.exit(1)


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


def split_text(text: str) -> list[str]:
    """Split text at sentence boundaries, keeping chunks under MAX_CHUNK_BYTES"""
    if len(text.encode("utf-8")) <= MAX_CHUNK_BYTES:
        return [text]

    chunks = []
    remaining = text

    while remaining:
        if len(remaining.encode("utf-8")) <= MAX_CHUNK_BYTES:
            chunks.append(remaining)
            break

        # Find a character limit that fits in byte limit
        char_limit = MAX_CHUNK_BYTES
        while len(remaining[:char_limit].encode("utf-8")) > MAX_CHUNK_BYTES:
            char_limit = int(char_limit * 0.9)

        slice_text = remaining[:char_limit]

        # Find last sentence boundary
        split_idx = -1
        for sep in [". ", "! ", "? ", ".\n", "!\n", "?\n"]:
            idx = slice_text.rfind(sep)
            if idx > split_idx:
                split_idx = idx + len(sep)

        # Fallback: split at last space
        if split_idx <= 0:
            split_idx = slice_text.rfind(" ")
        # Last resort: hard split
        if split_idx <= 0:
            split_idx = char_limit

        chunks.append(remaining[:split_idx].strip())
        remaining = remaining[split_idx:].strip()

    return [c for c in chunks if c]


def generate_audio(text: str, output_path: str, api_key: str) -> bool:
    """Generate audio using Google Cloud TTS (Neural2 voice, MP3 output)"""
    try:
        chunks = split_text(text)
        audio_parts = []

        for chunk in chunks:
            payload = json.dumps({
                "input": {"text": chunk},
                "voice": {"languageCode": TTS_LANGUAGE, "name": TTS_VOICE},
                "audioConfig": {"audioEncoding": "MP3"},
            }).encode("utf-8")

            url = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={api_key}"
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
            resp = urllib.request.urlopen(req)
            data = json.loads(resp.read())
            audio_parts.append(base64.b64decode(data["audioContent"]))

        # Concatenate MP3 chunks (simple append works for MP3 frames)
        with open(output_path, "wb") as f:
            for part in audio_parts:
                f.write(part)

        return True
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        log(f"  Google TTS API error {e.code}: {body}", "ERROR")
        if os.path.exists(output_path):
            os.remove(output_path)
        return False
    except Exception as e:
        log(f"  Generation error: {e}", "ERROR")
        if os.path.exists(output_path):
            os.remove(output_path)
        return False


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
    parser.add_argument("--slugs-file", type=str, default="", help="File with one slug per line to generate")
    args = parser.parse_args()

    api_key = get_api_key()

    log("=" * 60)
    log("Batch TTS Generation — Google Cloud TTS (Neural2)")
    log(f"Voice: {TTS_VOICE}")
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

    # Load slugs filter if provided
    slugs_filter: Optional[set] = None
    if args.slugs_file:
        slugs_path = Path(args.slugs_file)
        if not slugs_path.exists():
            log(f"Slugs file not found: {args.slugs_file}", "ERROR")
            sys.exit(1)
        slugs_filter = set()
        for line in slugs_path.read_text().strip().splitlines():
            s = line.strip()
            if s:
                # Convert content slug (e.g. "Kikuyu/Mau-Mau-Uprising") to audio slug (lowercase basename)
                audio_slug = s.split("/")[-1].lower()
                slugs_filter.add(audio_slug)
        log(f"Filtering to {len(slugs_filter)} slugs from {args.slugs_file}")

    # Build work list — when multiple files produce the same slug, keep the largest
    slug_to_note: dict[str, Path] = {}
    for note in all_notes:
        slug = slugify(note)
        if slugs_filter is not None and slug not in slugs_filter:
            continue
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

        if generate_audio(text, str(audio_path), api_key):
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
