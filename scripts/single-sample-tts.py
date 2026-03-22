#!/usr/bin/env python3
"""
Generate single Nvidia TTS sample for comparison with OpenAI
Output: public/audio/1963-independence-election.mp3
"""

import os
import sys
from pathlib import Path
from datetime import datetime

def log(msg: str):
    """Log with timestamp"""
    timestamp = datetime.now().isoformat()
    print(f"[{timestamp}] {msg}")

def main():
    log("="*70)
    log("Single Sample TTS Generation (Nvidia Glow-TTS + HiFi-GAN)")
    log("="*70)
    
    output_dir = Path("public/audio")
    os.makedirs(output_dir, exist_ok=True)
    
    # The text from first note
    text = """The 1963 independence election was the defining electoral contest that ushered Kenya from colonial rule to self-governance. Held in May 1963 under a framework negotiated at the Lancaster House conferences in London, the election saw KANU win a commanding majority, bringing Jomo Kenyatta to power as prime minister and setting the stage for formal independence on 12 December 1963."""
    
    output_slug = "1963-independence-election"
    output_wav = output_dir / f"{output_slug}.wav"
    output_mp3 = output_dir / f"{output_slug}.mp3"
    
    log(f"Text: {len(text)} characters")
    log(f"Output: {output_mp3}")
    log("")
    
    try:
        log("Loading TTS models...")
        from TTS.api import TTS
        
        tts = TTS(
            model_name="tts_models/en/ljspeech/glow-tts",
            progress_bar=True,
            gpu=False
        )
        
        log(f"Generating audio...")
        tts.tts_to_file(text=text, file_path=str(output_wav))
        
        log(f"Converting WAV to MP3...")
        import subprocess
        result = subprocess.run([
            "ffmpeg", "-i", str(output_wav),
            "-q:a", "5",
            "-y",
            str(output_mp3)
        ], capture_output=True, text=True, check=True)
        
        # Cleanup WAV
        if output_wav.exists():
            output_wav.unlink()
        
        # Report
        size_kb = output_mp3.stat().st_size / 1024
        
        log("")
        log("="*70)
        log(f"✓ COMPLETE")
        log(f"File: {output_mp3}")
        log(f"Size: {size_kb:.1f} KB")
        log("="*70)
        log("")
        log("COMPARISON READY:")
        log(f"  OpenAI:  ~/clawd/sample-audio-openai.mp3  (505 KB)")
        log(f"  Nvidia:  ~/clawd/sample-audio-nvidia.mp3   ({size_kb:.0f} KB)")
        log("")
        log("Download both files and listen to compare quality, speed, cost.")
        
        return 0
        
    except ImportError as e:
        log(f"ERROR: TTS library not found: {e}")
        log("(Install with: pip install TTS)")
        return 1
    except Exception as e:
        log(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
