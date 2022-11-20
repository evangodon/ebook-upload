#! /bin/bash

echo "Using $FOLDER folder"
watchexec -r -e go -- go run . --port 8080 --folder "$FOLDER"
