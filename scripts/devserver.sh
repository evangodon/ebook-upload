#! /bin/bash
echo "Using $FOLDER folder"
watchexec -r -e go,html,css -- go run . --port 8080 --folder "$FOLDER"
