package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/fsnotify/fsnotify"
)

type config struct {
	port       int
	folderPath string
	devMode    bool
}

type application struct {
	cfg         config
	filewatcher *fsnotify.Watcher
}

func main() {
	port := flag.Int("port", 8080, "API server port")
	folder := flag.String("folder", ".", "Folder Path")
	devMode := flag.Bool("dev", false, "Run in dev mode")
	flag.Parse()

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal("FileWatcher failed: ", err)
	}
	defer watcher.Close()

	absPath, err := filepath.Abs(*folder)
	if err != nil {
		log.Fatal("Failed to get absolute path: ", err)
	}

	app := application{
		cfg: config{
			port:       *port,
			folderPath: absPath + "/",
			devMode:    *devMode,
		},
		filewatcher: watcher,
	}

	http.Handle(app.cfg.folderPath, app.getFile())
	http.Handle("/static/", app.fileServer())
	http.HandleFunc("/upload-ebook", app.postEbook())
	http.Handle("/filewatcher", app.fileWatcher())
	http.HandleFunc("/", app.getHomePage())

	fmt.Printf("🚀 Starting server at http://localhost:%d\n", app.cfg.port)
	addr := fmt.Sprintf(":%d", app.cfg.port)

	err = http.ListenAndServe(addr, nil)
	if err != nil {
		fmt.Printf("error starting server: %s\n", err)
		os.Exit(1)
	}
}
