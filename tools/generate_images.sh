#!/usr/bin/env bash
#
# generate_images.sh — replacement for jekyll_picture_tag's "generated" pipeline.
#
# Reads presets from data/picture.yml (default + archive) and, for every image in
# static/images/, writes resized + webp variants to $OUTPUT/generated/ using
# exactly the same naming scheme jekyll_picture_tag used:
#
#   <base>-<width>w<ext>        (original format, resized)
#   <base>-webp-<width>w<ext>   (webp, resized)
#
# The <picture> partials reference these under /generated/ on S3, where they are
# cached forever (content-hashed paths) — same as before the Hugo migration.
#
# Usage: ./tools/generate_images.sh [output_dir]
#   output_dir defaults to ./public
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="${1:-$ROOT/public}"
SRC="$ROOT/static/images"
OUT="$OUTPUT/generated"
mkdir -p "$OUT"

command -v vipsthumbnail >/dev/null 2>&1 || { echo "error: libvips (vipsthumbnail) is required" >&2; exit 1; }
command -v cwebp >/dev/null 2>&1 || { echo "error: cwebp is required" >&2; exit 1; }
command -v gif2webp >/dev/null 2>&1 || { echo "error: gif2webp is required" >&2; exit 1; }

# Parse the output widths (the "NNpx" values, not the breakpoint keys) out of a
# preset's sizes block from data/picture.yml.
preset_sizes() {
  awk -v preset="$1" '
    $0 ~ "^  " preset ":" { in_preset=1; next }
    in_preset && /^  [a-z]/ { in_preset=0 }
    in_preset && $0 ~ /^      [0-9]+: *[0-9]+px$/ {
      sub(/^.*: */, ""); sub(/px$/, ""); print
    }
  ' "$ROOT/data/picture.yml"
}

for img in "$SRC"/*; do
  [ -f "$img" ] || continue
  base="$(basename "$img")"
  stem="${base%.*}"
  ext="${base##*.}"
  lower_ext="$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')"
  case "$lower_ext" in
    png|jpeg|jpg|gif|webp|avif) ;;
    *) continue ;;
  esac

  # Quality options are only meaningful (and only accepted) by the jpeg saver.
  save_opts=""
  case "$lower_ext" in
    jpg|jpeg) save_opts="[Q=70]" ;;
  esac

  for preset in default archive; do
    while read -r width; do
      [ -n "$width" ] || continue
      # Original format, resized
      resized="$OUT/$stem-${width}w.$lower_ext"
      vipsthumbnail -s "$width" --path="$resized$save_opts" "$img"
      # Webp variant. cwebp can't read GIF input, so re-encode the already-resized
      # GIF with gif2webp instead of resizing the source again.
      if [ "$lower_ext" = "gif" ]; then
        gif2webp -q 70 -quiet "$resized" -o "$OUT/$stem-webp-${width}w.webp"
      else
        cwebp -q 70 -resize "$width" 0 -quiet -mt -o "$OUT/$stem-webp-${width}w.webp" "$img" >/dev/null
      fi
    done < <(preset_sizes "$preset")
  done
done

echo "generated images in $OUT"
