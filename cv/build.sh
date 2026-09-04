#!/usr/bin/env bash
# Compile the CV with pdflatex, refuse anything but exactly one page, and
# publish it to public/ where the Hero "Download CV" link points.
set -euo pipefail

cd "$(dirname "$0")"
NAME=resume-yusuf-anil-yazici
OUT=build
mkdir -p "$OUT"

# Two passes so hyperref's link targets and tabular widths settle.
for _ in 1 2; do
  pdflatex -interaction=nonstopmode -halt-on-error -output-directory="$OUT" "$NAME.tex" >/dev/null
done

PAGES=$(pdfinfo "$OUT/$NAME.pdf" | awk '/^Pages:/ {print $2}')
if [ "$PAGES" != "1" ]; then
  echo "error: CV is $PAGES pages, must be exactly 1 — tighten $NAME.tex" >&2
  exit 1
fi

cp "$OUT/$NAME.pdf" "../public/$NAME.pdf"
echo "ok: 1 page -> public/$NAME.pdf"
