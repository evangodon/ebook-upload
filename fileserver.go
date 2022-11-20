package main

import (
	"embed"
	"log"
	"net/http"
	"os"
)

var (
	//go:embed static
	staticEmbed embed.FS
)

func (app application) fileServer() http.Handler {
	if app.cfg.devMode {
		log.Print("Using live filesystem")
		staticFS := os.DirFS("./static")
		httpFS := http.FS(staticFS)
		return http.StripPrefix("/static", http.FileServer(httpFS))
	}

	log.Print("Using embed filesystem")
	return http.FileServer(http.FS(staticEmbed))
}
