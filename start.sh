#!/usr/bin/env bash

DENO_DEPLOYMENT_ID=$(git rev-parse HEAD)

deno run --allow-read --allow-env --allow-run --allow-write  --allow-net  main.ts
