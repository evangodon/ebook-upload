package main

import (
	"embed"
	"flag"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
)

type config struct {
	port       int
	folderPath string
}

type application struct {
	cfg config
}

var (
	//go:embed static
	static embed.FS
)

func main() {
	app := application{
		cfg: config{},
	}
	flag.IntVar(&app.cfg.port, "port", 8080, "API server port")
	flag.StringVar(&app.cfg.folderPath, "folder", "", "Folder Path")
	flag.Parse()

	absPath, err := filepath.Abs(app.cfg.folderPath)
	if err != nil {
		panic(err)
	}
	app.cfg.folderPath = absPath + "/"

	fs := http.FileServer(http.FS(static))
	http.Handle("/static/", fs)

	http.Handle(app.cfg.folderPath, app.getFile())
	http.HandleFunc("/upload-ebook", app.postEbook())
	http.HandleFunc("/", app.getHomePage())

	fmt.Printf("🚀 Starting server at http://localhost:%d\n", app.cfg.port)
	addr := fmt.Sprintf(":%d", app.cfg.port)

	err = http.ListenAndServe(addr, nil)
	if err != nil {
		fmt.Printf("error starting server: %s\n", err)
		os.Exit(1)
	}
}
