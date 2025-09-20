#!/bin/sh

set -eu

[ $# -eq 1 ] || { printf 'Usage: %s <file.css>\n' "$0" >&2; exit 1; }
SRC=$1
[ -f "$SRC" ] || { printf 'Error: %s not found\n' "$SRC" >&2; exit 1; }

DST=$(dirname -- "$SRC")/$(basename -- "$SRC" .css).min.css

sed 's:/\*[^*]*\*[^/]*\*/::g' "$SRC" \
| tr -d '\n' \
| tr -s ' \t' ' ' \
| sed 's/ *{ */{/g; s/ *} */}/g; s/ *: */:/g; s/ *; */;/g; s/ *, */,/g; s/;}/}/g' \
> "$DST"

printf 'Minified: %s\n' "$DST"
