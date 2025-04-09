#!/bin/sh

set -- "index" "natural-calendar" "natural-rhythm"

[ ! -d "$1" ] && mkdir "$1" ; pandoc src/"$1".md -o "$1".html --template=layouts/default.html
[ ! -d "$2" ] && mkdir "$2" ; pandoc src/"$2".md -o "$2"/index.html --template=layouts/default.html
[ ! -d "$3" ] && mkdir "$3" ; pandoc src/"$3".md -o "$3"/index.html --template=layouts/default.html

cleancss -o assets/styles/style.min.css "$(echo -n assets/styles/global/{reset,variables,typography,document}.css)" "$(echo -n assets/styles/layout/{header,section,footer}.css)" "$(echo -n assets/styles/elements/{container,images}).css"
