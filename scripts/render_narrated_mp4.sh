#!/usr/bin/env bash
set -euo pipefail

SOURCE_VIDEO="assets/ntpc-procurement-agent-demo-fast.mp4"
SLOWED_VIDEO="assets/ntpc-procurement-agent-demo-65pct-speed.mp4"
AUDIO="assets/demo-narration.mp3"
OUTPUT="assets/ntpc-procurement-agent-demo-narrated.mp4"
SPEED_REDUCTION_PERCENT="35"

if command -v ffmpeg >/dev/null 2>&1; then
  FFMPEG_BIN="$(command -v ffmpeg)"
else
  FFMPEG_BIN="$(
    python - <<'PY'
import sys
try:
    import imageio_ffmpeg
except Exception:
    sys.exit(1)
print(imageio_ffmpeg.get_ffmpeg_exe())
PY
  )" || {
    echo "ffmpeg not found on PATH and imageio-ffmpeg is not installed."
    echo "Install ffmpeg or run: python -m pip install imageio-ffmpeg"
    exit 1
  }
fi

SPEED_FACTOR="$(python - "$SPEED_REDUCTION_PERCENT" <<'PY'
import sys
reduction = float(sys.argv[1])
print(f"{1/(1-reduction/100):.6f}")
PY
)"

echo "Creating slowed video at 65% speed (${SPEED_REDUCTION_PERCENT}% slower)..."
"$FFMPEG_BIN" -y \
  -i "$SOURCE_VIDEO" \
  -an \
  -filter:v "setpts=${SPEED_FACTOR}*PTS" \
  "$SLOWED_VIDEO"

echo "Muxing slowed video with narration..."
"$FFMPEG_BIN" -y \
  -i "$SLOWED_VIDEO" \
  -i "$AUDIO" \
  -map 0:v:0 -map 1:a:0 \
  -c:v copy \
  -c:a aac -b:a 160k \
  -shortest \
  "$OUTPUT"

echo "Rendered $OUTPUT"
