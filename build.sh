#!/bin/sh

# Directory of markdown files without trailing slash
DIR="src"

# If no arguments are passed
if [ $# -eq 0 ]; then
  # Pass all markdown files as arguments
  set -- $(ls "$DIR" | awk -v DIR="$DIR" '{print DIR "/" $0}')
fi

for filepath in "$@"; do
  # If the argument references an existing file
  if [ -e "$filepath" ]; then
    # Extract filename without extension
    filename=$(basename "$filepath" .md)
    # If isn't the index
    if [ "$filename" != "index" ]; then
      # Generate the directory for that HTML page
      [ ! -d "$filename" ] && mkdir "$filename"
      # Generate the HTML page inside that directory
      pandoc "$filepath" -o "$filename"/index.html --template=layouts/default.html
    else
      # Generate index.html in root directory
      pandoc "$filepath" -o index.html --template=layouts/default.html
    fi
  fi
done

# Generate compiled and minified CSS
cleancss -o assets/styles/style.min.css $(echo -n assets/styles/global/{reset,variables,typography,document}.css) $(echo -n assets/styles/layout/{header,section,footer,container}.css) assets/styles/elements/all.css

exit 1
