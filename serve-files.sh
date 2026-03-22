#!/bin/bash
# Simple file server for Railway to serve generated TTS files

PORT=${PORT:-8080}
DIR=${1:-/app/public}

echo "=================================================="
echo "Starting file server on port $PORT"
echo "Serving directory: $DIR"
echo "=================================================="

cd "$DIR" && python3 -m http.server $PORT
