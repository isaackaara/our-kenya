#!/usr/bin/env python3
"""
Single-sample TTS generation using LuxTTS for quality comparison.
Generates audio for Kenya independence note only.
"""

import os
import sys
from pathlib import Path
import soundfile as sf

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def main():
    print("=== LuxTTS Single-Sample Generation ===")
    print(f"Project root: {project_root}")
    
    # Import LuxTTS
    try:
        from zipvoice.luxvoice import LuxTTS
        print("✓ LuxTTS imported successfully")
    except ImportError as e:
        print(f"✗ Failed to import LuxTTS: {e}")
        print("Run: pip install -r requirements-luxtts.txt")
        sys.exit(1)
    
    # Initialize model
    print("\n[1/4] Loading LuxTTS model...")
    device = 'cuda' if os.environ.get('CUDA_VISIBLE_DEVICES') else 'cpu'
    print(f"Using device: {device}")
    
    lux_tts = LuxTTS('YatharthS/LuxTTS', device=device)
    print("✓ Model loaded")
    
    # Sample text (Kenya independence)
    text = """
    On December 12th, 1963, Kenya became an independent nation, 
    marking the end of British colonial rule. Jomo Kenyatta, 
    leader of the Kenya African National Union, became the country's 
    first Prime Minister. At midnight, the Union Jack was lowered 
    and the new Kenyan flag was raised for the first time at 
    Uhuru Gardens in Nairobi. Thousands gathered to witness this 
    historic moment as Kenya joined the community of independent nations.
    """
    
    print(f"\n[2/4] Text to synthesize ({len(text)} chars):")
    print(text[:100] + "...")
    
    # Reference audio
    # For this test, we'll use a generic reference or create one
    # In production, we'd use a curated narrator voice
    
    # Check if reference audio exists, if not, we need to handle it
    ref_audio_path = project_root / "reference-voice.wav"
    
    if not ref_audio_path.exists():
        print(f"\n⚠ Reference audio not found at {ref_audio_path}")
        print("LuxTTS requires 3+ seconds of reference audio for voice cloning.")
        print("\nOptions:")
        print("1. Add reference-voice.wav to project root")
        print("2. Use OpenAI sample as reference (meta approach)")
        print("3. Record a quick voice sample")
        
        # For now, try to use OpenAI sample if it exists in expected location
        openai_sample = Path.home() / "clawd" / "sample-audio-openai.mp3"
        if openai_sample.exists():
            print(f"\n→ Using OpenAI sample as reference: {openai_sample}")
            ref_audio_path = openai_sample
        else:
            print("\n✗ No reference audio available. Cannot proceed.")
            print("Please add reference-voice.wav (3+ sec audio file) to project root.")
            sys.exit(1)
    
    # Encode reference audio
    print(f"\n[3/4] Encoding reference audio: {ref_audio_path}")
    encoded_prompt = lux_tts.encode_prompt(
        str(ref_audio_path),
        duration=5,  # Use 5 seconds of reference
        rms=0.01     # Recommended loudness
    )
    print("✓ Reference encoded")
    
    # Generate speech
    print("\n[4/4] Generating speech...")
    final_wav = lux_tts.generate_speech(
        text,
        encoded_prompt,
        num_steps=4,      # Best quality/speed balance
        t_shift=0.9,      # Higher quality, may have pronunciation quirks
        speed=1.0,        # Normal speed
        return_smooth=False  # Cleaner sound
    )
    print("✓ Speech generated")
    
    # Save output
    output_dir = project_root / "public" / "audio"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "1963-independence-election-luxtts.mp3"
    
    # LuxTTS outputs at 48kHz
    final_wav_np = final_wav.numpy().squeeze()
    
    # Save as WAV first
    wav_path = output_dir / "1963-independence-election-luxtts.wav"
    sf.write(str(wav_path), final_wav_np, 48000)
    print(f"\n✓ WAV saved: {wav_path}")
    
    # Convert to MP3 (requires ffmpeg)
    import subprocess
    try:
        subprocess.run([
            'ffmpeg', '-i', str(wav_path),
            '-codec:a', 'libmp3lame',
            '-qscale:a', '2',  # High quality MP3
            '-y',  # Overwrite
            str(output_path)
        ], check=True, capture_output=True)
        print(f"✓ MP3 saved: {output_path}")
        
        # Clean up WAV
        wav_path.unlink()
        
        # Show file size
        size_kb = output_path.stat().st_size / 1024
        print(f"✓ File size: {size_kb:.1f} KB")
        
    except subprocess.CalledProcessError as e:
        print(f"⚠ FFmpeg conversion failed: {e}")
        print(f"WAV file available at: {wav_path}")
    except FileNotFoundError:
        print("⚠ FFmpeg not found. Install with: apt-get install ffmpeg")
        print(f"WAV file available at: {wav_path}")
    
    print("\n=== LuxTTS Generation Complete ===")
    print(f"Output: {output_path}")
    print("\nCompare with:")
    print("- OpenAI sample: ~/clawd/sample-audio-openai.mp3")
    print("- Nvidia sample: public/audio/1963-independence-election.mp3")

if __name__ == "__main__":
    main()
