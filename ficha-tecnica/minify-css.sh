#!/bin/sh
# Minify a CSS file into .min.css (POSIX + KISS)

set -eu

[ $# -eq 1 ] || { printf 'Usage: %s <file.css>\n' "$0" >&2; exit 1; }
SRC=$1
[ -f "$SRC" ] || { printf 'Error: %s not found\n' "$SRC" >&2; exit 1; }

DST=$(dirname -- "$SRC")/$(basename -- "$SRC" .css).min.css

# Remove /* ... */ comments across lines
awk '
  BEGIN { in_comment = 0 }
  {
    line = $0
    if (in_comment) {
      end = index(line, "*/")
      if (end) {
        line = substr(line, end + 2)
        in_comment = 0
      } else next
    }
    while (1) {
      start = index(line, "/*")
      if (!start) break
      rest = substr(line, start + 2)
      end = index(rest, "*/")
      if (end) {
        line = substr(line, 1, start - 1) substr(rest, end + 2)
      } else {
        line = substr(line, 1, start - 1)
        in_comment = 1
        break
      }
    }
    print line
  }
' "$SRC" \
| tr -d '\n' \
| tr -s ' \t' ' ' \
| sed 's/ *{ */{/g; s/ *} */}/g; s/ *: */:/g; s/ *; */;/g; s/ *, */,/g; s/;}/}/g' \
> "$DST"

printf 'Minified: %s\n' "$DST"

