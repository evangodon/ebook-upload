#! /bin/bash

echo "Using $FOLDER folder"
watchexec -r -e go,html,css,js -- go run . --port 8080 --folder "$FOLDER"
