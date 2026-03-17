#!/bin/bash
# Build script that preserves hero-graph.json after Quartz build

# 1. Extract graph data
echo "Extracting graph data..."
node scripts/extract-graph.js

# 2. Save it temporarily
echo "Saving graph data..."
mkdir -p /tmp/hero-graph-backup
cp /tmp/hero-graph-data.json /tmp/hero-graph-backup/hero-graph.json 2>/dev/null || true

# 3. Run Quartz build
echo "Building with Quartz..."
npx quartz build -d content

# 4. Restore the graph data after Quartz build
echo "Restoring graph data..."
mkdir -p public/data
node -e "
const fs = require('fs');
const path = require('path');

// Recreate the graph data in the public directory
const contentDir = path.join(process.cwd(), 'content');
const outputFile = path.join(process.cwd(), 'public/data/hero-graph.json');

// Re-run extraction to get fresh data
const extractGraph = require('./scripts/extract-graph.js');
" || node scripts/extract-graph.js && cp /tmp/graph-data.json public/data/hero-graph.json 2>/dev/null || true

echo "Build complete!"
