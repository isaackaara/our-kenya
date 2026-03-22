#!/bin/bash
set -e

echo "=== Starting TTS Service ==="

# Check if audio files already exist
if [ -f "/app/public/audio/1963-independence-election-luxtts.mp3" ]; then
    echo "Audio files already exist, skipping generation"
else
    echo "Generating audio files..."
    python3 /app/scripts/single-sample-luxtts.py || echo "Generation failed, continuing with server..."
fi

echo "Starting web server..."
python3 /app/serve.py
