#!/usr/bin/env bash
set -euo pipefail

VIDEO="assets/ntpc-procurement-agent-demo-fast.mp4"
AUDIO="assets/demo-narration.mp3"
OUTPUT="assets/ntpc-procurement-agent-demo-narrated.mp4"

ffmpeg -y   -i "$VIDEO"   -i "$AUDIO"   -map 0:v:0 -map 1:a:0   -c:v copy   -c:a aac -b:a 160k   -shortest   "$OUTPUT"

echo "Rendered $OUTPUT"
