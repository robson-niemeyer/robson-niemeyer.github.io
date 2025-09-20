#!/bin/sh

src="./assets/css/style.css"
dst="./assets/css/style.min.css"

sed 's:/\*[^*]*\*[^/]*\*/::g' "$src" | \
tr -d '\n' | \
tr -s ' \t' ' ' | \
sed 's/ \?{\s*/{/g; s/ \?}\s*/}/g; s/ \?:\s*/:/g; s/ \?;\s*/;/g; s/ \?,\s*/,/g; s/;}/}/g' \
> "$dst"
