#!/bin/sh

# Generate compiled and minified CSS
cleancss -o assets/styles/style.min.css $(echo -n assets/styles/{reset,variables,typography,layout,elements}.css)
