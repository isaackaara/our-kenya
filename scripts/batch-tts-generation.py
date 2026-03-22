#!/usr/bin/env python3
"""
Batch TTS Generation for Our Kenya
Generates audio for all notes using Nvidia FastPitch + HiFi-GAN (via TTS library)
Output: MP3 files at public/audio/{slug}.mp3
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

# Configuration
CONTENT_DIR = Path("content")
AUDIO_OUTPUT_DIR = Path("public/audio")
LOG_FILE = Path("batch-tts-generation.log")
CHECKPOINT_FILE = Path(".tts-checkpoint.json")

# TTS Settings
TTS_QUALITY = 5  # ffmpeg quality: lower = better (5 = ~128kbps MP3)
MODEL_NAME = "tts_models/en/ljspeech/glow-tts"
BATCH_SIZE = 5  # Process N files before checkpointing
SKIP_EXISTING = True  # Don't regenerate if audio already exists

def log(msg: str, level: str = "INFO"):
    """Log to file and stdout"""
    timestamp = datetime.now().isoformat()
    log_msg = f"[{timestamp}] [{level}] {msg}"
    print(log_msg)
    with open(LOG_FILE, "a") as f:
        f.write(log_msg + "\n")

def extract_readable_text(md_content: str) -> Optional[str]:
    """
    Extract readable text from markdown, excluding metadata sections
    Rules:
    - Skip YAML front matter
    - Extract main content until "See Also" or "Sources"
    - Remove wikilinks [[...]] but keep text
    - Remove internal markdown links but keep text
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
        if re.match(r"^#+\s*(see also|sources)", line, re.IGNORECASE):
            cutoff_idx = i
            break
    
    content = "\n".join(lines[:cutoff_idx])
    
    # Remove wikilinks but keep text: [[Link|Text]] -> Text, [[Link]] -> Link
    content = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", r"\2", content)
    content = re.sub(r"\[\[([^\]]+)\]\]", r"\1", content)
    
    # Remove markdown links but keep text: [text](url) -> text
    content = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", content)
    
    # Remove markdown formatting
    content = re.sub(r"[*_`#]", "", content)
    
    # Clean up whitespace
    content = " ".join(content.split())
    
    # Minimum length check
    if len(content) < 50:
        return None
    
    return content.strip()

def load_checkpoint() -> dict:
    """Load checkpoint to resume from last position"""
    if CHECKPOINT_FILE.exists():
        with open(CHECKPOINT_FILE) as f:
            return json.load(f)
    return {"processed": [], "failed": [], "last_batch": 0}

def save_checkpoint(data: dict):
    """Save checkpoint"""
    with open(CHECKPOINT_FILE, "w") as f:
        json.dump(data, f, indent=2)

def generate_audio_tts_library(text: str, output_path: str) -> bool:
    """Generate audio using TTS library (Glow-TTS + HiFi-GAN)"""
    try:
        from TTS.api import TTS
        
        # Initialize once (cached)
        if not hasattr(generate_audio_tts_library, "tts_engine"):
            log(f"Loading {MODEL_NAME} model...", "INFO")
            generate_audio_tts_library.tts_engine = TTS(
                model_name=MODEL_NAME,
                progress_bar=False,
                gpu=False  # CPU is fine, Railway free tier
            )
        
        tts = generate_audio_tts_library.tts_engine
        wav_path = output_path.replace(".mp3", ".wav")
        
        # Generate WAV
        tts.tts_to_file(text=text, file_path=wav_path)
        
        # Convert to MP3
        result = subprocess.run([
            "ffmpeg", "-i", wav_path,
            "-q:a", str(TTS_QUALITY),
            "-y",  # Overwrite
            output_path
        ], capture_output=True, text=True, check=True)
        
        # Cleanup WAV
        if os.path.exists(wav_path):
            os.remove(wav_path)
        
        return True
    except Exception as e:
        log(f"TTS generation error: {e}", "ERROR")
        return False

def process_note(md_file: Path, checkpoint: dict) -> bool:
    """Process a single note file"""
    slug = md_file.stem
    audio_path = AUDIO_OUTPUT_DIR / f"{slug}.mp3"
    
    # Skip if already processed
    if SKIP_EXISTING and audio_path.exists():
        log(f"Skipping {slug} (audio exists)", "DEBUG")
        return True
    
    if slug in checkpoint["failed"]:
        log(f"Skipping {slug} (previously failed)", "DEBUG")
        return False
    
    # Read and extract text
    try:
        with open(md_file, encoding="utf-8") as f:
            content = f.read()
        
        text = extract_readable_text(content)
        if not text:
            log(f"No readable text in {slug}", "WARN")
            checkpoint["failed"].append(slug)
            return False
        
        # Generate audio
        log(f"Generating audio for {slug} ({len(text)} chars)...", "INFO")
        os.makedirs(AUDIO_OUTPUT_DIR, exist_ok=True)
        
        if generate_audio_tts_library(text, str(audio_path)):
            size_kb = os.path.getsize(audio_path) / 1024
            log(f"✓ {slug} ({size_kb:.1f} KB)", "INFO")
            checkpoint["processed"].append(slug)
            return True
        else:
            log(f"✗ {slug} generation failed", "ERROR")
            checkpoint["failed"].append(slug)
            return False
    
    except Exception as e:
        log(f"Error processing {slug}: {e}", "ERROR")
        checkpoint["failed"].append(slug)
        return False

def main():
    """Main batch generation loop"""
    log("=" * 60)
    log("Starting batch TTS generation for Our Kenya", "INFO")
    log(f"Content dir: {CONTENT_DIR}")
    log(f"Output dir: {AUDIO_OUTPUT_DIR}")
    log(f"Model: {MODEL_NAME}")
    log("=" * 60)
    
    # Verify environment
    if not CONTENT_DIR.exists():
        log(f"Content directory not found: {CONTENT_DIR}", "ERROR")
        sys.exit(1)
    
    # Load checkpoint
    checkpoint = load_checkpoint()
    log(f"Resuming from checkpoint: {len(checkpoint['processed'])} done, {len(checkpoint['failed'])} failed")
    
    # Find all markdown files
    md_files = sorted(CONTENT_DIR.glob("*.md"))
    total = len(md_files)
    log(f"Found {total} markdown files")
    
    # Process in batches
    processed_in_batch = 0
    start_time = time.time()
    
    for i, md_file in enumerate(md_files, 1):
        slug = md_file.stem
        
        # Skip if already processed
        if slug in checkpoint["processed"] or slug in checkpoint["failed"]:
            continue
        
        # Process
        success = process_note(md_file, checkpoint)
        processed_in_batch += 1
        
        # Checkpoint every N files
        if processed_in_batch >= BATCH_SIZE:
            save_checkpoint(checkpoint)
            elapsed = time.time() - start_time
            rate = processed_in_batch / elapsed
            remaining = (total - i) / rate if rate > 0 else 0
            log(f"Checkpoint: {i}/{total} done ({rate:.2f} files/sec, ~{remaining/3600:.1f}h remaining)", "INFO")
            processed_in_batch = 0
            start_time = time.time()
    
    # Final checkpoint
    save_checkpoint(checkpoint)
    
    # Summary
    log("=" * 60)
    log(f"COMPLETE: {len(checkpoint['processed'])} generated, {len(checkpoint['failed'])} failed", "INFO")
    log(f"Audio saved to: {AUDIO_OUTPUT_DIR}", "INFO")
    log("=" * 60)
    
    if checkpoint["failed"]:
        log(f"Failed notes: {', '.join(checkpoint['failed'][:10])}" + 
            ("..." if len(checkpoint["failed"]) > 10 else ""), "WARN")

if __name__ == "__main__":
    main()
