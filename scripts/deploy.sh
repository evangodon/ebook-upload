#! /bin/bash
#
git pull origin main
go build -o build/ebook-fs

pm2 restart ebook-fs


