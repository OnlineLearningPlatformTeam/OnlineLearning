#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# OLP · build-previews.sh — card video previews
#
# Two roles, two files per course:
#   src/assets/media/trailer-cardN.mp4  — the real course video, played by the
#                                         details modal (optional, yours to add)
#   src/assets/media/preview-cardN.mp4  — a short silent loop for the card,
#                                         generated here
#
# For every course without a preview-cardN.mp4 this script creates one: from
# trailer-cardN.mp4 if that exists, otherwise from the course artwork
# (src/assets/img-card*.png) with a slow zoom. No burned-in text.
#
# Existing preview-cardN.mp4 files are NEVER overwritten (add FORCE=1 to
# rebuild them anyway). Set CAPTIONS=1 to burn a caption into artwork clips.
#
# Requires ffmpeg 5+ with libx264. Run from the project root:
#   bash scripts/build-previews.sh
#
# Re-run after changing the artwork or the captions below. To use real
# course footage instead, drop your own file in as
# src/assets/media/preview-cardN.mp4 — nothing else has to change.
# ═══════════════════════════════════════════════════════════════════
set -euo pipefail

SRC="src/assets"
OUT="$SRC/media"
DURATION=6            # seconds
CRF=30                # quality/size (lower = bigger)
FPS=30
CAPTIONS="${CAPTIONS:-0}"   # 1 = burn "title · meta" into the clip, 0 = clean footage
FORCE="${FORCE:-0}"         # 1 = rebuild preview clips that already exist

# first sans-serif we can find (Linux / macOS / Git-Bash)
FONT=""
for candidate in \
  /usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf \
  /usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf \
  /System/Library/Fonts/Supplemental/Arial Bold.ttf \
  "C:/Windows/Fonts/arialbd.ttf"
do
  [ -f "$candidate" ] && FONT="$candidate" && break
done
if [ -z "$FONT" ]; then
  echo "!! no bold font found — captions will be skipped"
fi

command -v ffmpeg >/dev/null || { echo "!! ffmpeg is not installed (https://ffmpeg.org)"; exit 1; }
mkdir -p "$OUT"

# id | title | meta line
COURSES=(
  "1|Web Development Bootcamp|Preview  ·  12 weeks  ·  60 hours"
  "2|UI/UX Design Essentials|Preview  ·  10 weeks  ·  50 hours"
  "3|Python Programming Masterclass|Preview  ·  10 weeks  ·  50 hours"
  "4|Graphic Design & Vector Art|Preview  ·  8 weeks  ·  40 hours"
  "5|English Language & Professional Communication|Preview  ·  6 weeks  ·  30 hours"
  "6|Digital Marketing & Growth Strategy|Preview  ·  8 weeks  ·  40 hours"
)

for row in "${COURSES[@]}"; do
  IFS='|' read -r id title meta <<< "$row"
  in="$SRC/img-card$id.png"
  trailer="$OUT/trailer-card$id.mp4"
  out="$OUT/preview-card$id.mp4"
  [ -f "$in" ] || { echo "!! missing $in"; continue; }

  if [ -f "$out" ] && [ "$FORCE" != "1" ]; then
    echo "· keeping existing $out (FORCE=1 to rebuild)"
    continue
  fi

  # a real trailer exists → cut a short, silent loop out of it (this is what
  # the cards play on hover; the full trailer stays in the modal player)
  if [ -f "$trailer" ]; then
    echo "→ $out  (from trailer-card$id.mp4)"
    ffmpeg -y -hide_banner -loglevel error -i "$trailer" -t "$DURATION" \
      -vf "scale=1280:720:force_original_aspect_ratio=increase:flags=lanczos,crop=1280:720,setsar=1,fps=$FPS,format=yuv420p" \
      -an -c:v libx264 -preset veryfast -crf "$CRF" -movflags +faststart "$out"
    continue
  fi

  echo "→ $out  ($title)"
  filters="[0:v]scale=1440:810:force_original_aspect_ratio=increase:flags=lanczos,crop=1440:810,setsar=1[bg];"
  filters+="[bg]zoompan=z='min(1+0.02*on/$((DURATION * FPS)),1.10)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)+8*sin(on/60)':d=$((DURATION * FPS)):s=1280x720:fps=$FPS,format=yuv420p[z];"
  if [ "$CAPTIONS" = "1" ] && [ -n "$FONT" ]; then
    filters+="[z]drawbox=x=0:y=470:w=1280:h=250:color=black@0.55:t=fill[s];"
    filters+="[s]drawtext=fontfile='$FONT':text='$title':fontcolor=white:fontsize=46:x=56:y=560:shadowcolor=black@0.6:shadowx=0:shadowy=2,"
    filters+="drawtext=fontfile='$FONT':text='$meta':fontcolor=0xbfdbfe:fontsize=24:x=58:y=620[s2];"
  else
    filters+="[z]null[s2];"
  fi
  fade_out=$(awk "BEGIN{print $DURATION-0.4}")
  filters+="[s2]fade=t=in:st=0:d=0.4,fade=t=out:st=$fade_out:d=0.4[v]"

  ffmpeg -y -hide_banner -loglevel error -loop 1 -i "$in" -t "$DURATION" \
    -filter_complex "$filters" -map "[v]" \
    -c:v libx264 -preset veryfast -crf "$CRF" -pix_fmt yuv420p -movflags +faststart \
    "$out"
done

echo
echo "done — previews in $OUT"
ls -la "$OUT"
