#!/bin/sh

for file in *.jpg; do
  cwebp -q 80 "$file" -o "${file%.*}".webp
done

exit 1
