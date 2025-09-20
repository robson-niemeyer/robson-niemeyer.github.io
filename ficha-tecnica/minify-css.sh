#!/bin/sh
# Minify one CSS file, output as .min.css in same directory

if [ $# -ne 1 ]; then
  echo "Usage: $0 path/to/file.css" >&2
  exit 1
fi

SRC=$1

case $SRC in
  *.css) ;;
  *)
    echo "Error: input must be a .css file" >&2
    exit 1
    ;;
esac

if [ ! -f "$SRC" ]; then
  echo "Error: $SRC not found" >&2
  exit 1
fi

# Separate directory and filename
DIR=$(dirname -- "$SRC")
BASE=$(basename -- "$SRC" .css)
DST="${DIR}/${BASE}.min.css"

sed 's:/\*[^*]*\*[^/]*\*/::g' "$SRC" | \
tr -d '\n' | \
tr -s ' \t' ' ' | \
sed 's/ \?{\s*/{/g; s/ \?}\s*/}/g; s/ \?:\s*/:/g; s/ \?;\s*/;/g; s/ \?,\s*/,/g; s/;}/}/g' \
> "$DST"

echo "Minified: $DST"
