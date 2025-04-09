#!/bin/sh
set -- "index" "natural-calendar" "natural-rhythm"
pandoc src/"$1".md -o "$1".html --template=layouts/default.html
pandoc src/"$2".md -o "$2".html --template=layouts/default.html
pandoc src/"$3".md -o "$3".html --template=layouts/default.html
cleancss -o assets/styles/style.min.css "$(echo -n assets/styles/global/{reset,variables,typography,document}.css)" "$(echo -n assets/styles/layout/{header,section,footer}.css)" assets/styles/elements/container.css
