#!/usr/bin/env bash.origin.script

echo ">>>TEST_IGNORE_LINE:Possible EventEmitter memory leak detected.<<<"

pinf.it .

echo "---"

cat .dist/page.html

echo -e "\n---"

ls .dist/page.js

echo "---"

cat .dist/announcer.rep.js

echo -e "\n---"

echo "OK"
