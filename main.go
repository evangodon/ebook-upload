package main

import (
	"embed"
	"errors"
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"text/template"
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
	app.cfg.folderPath = absPath

	fs := http.FileServer(http.FS(static))
	http.Handle("/static/", fs)

	http.HandleFunc("/", app.getHomePage)

	fmt.Printf("🚀 Starting server at %d\n", app.cfg.port)
	addr := fmt.Sprintf(":%d", app.cfg.port)

	err = http.ListenAndServe(addr, nil)
	if errors.Is(err, http.ErrServerClosed) {
		fmt.Printf("server closed\n")
	} else if err != nil {
		fmt.Printf("error starting server: %s\n", err)
		os.Exit(1)
	}
}

type File struct {
	Name string
	Path string
}
type Data struct {
	Files      []File
	FolderPath string
}

func (app application) getHomePage(w http.ResponseWriter, _ *http.Request) {
	tmpl, err := static.ReadFile("static/index.html")
	if err != nil {
		panic(err)
	}

	t, err := template.New("homepage").Parse(string(tmpl))
	if err != nil {
		panic(err)
	}

	files, err := ioutil.ReadDir(app.cfg.folderPath)
	if err != nil {
		panic(err)
	}

	data := Data{
		Files:      []File{},
		FolderPath: app.cfg.folderPath,
	}

	for _, file := range files {
		if !file.IsDir() {
			name := file.Name()
			path := path.Join(app.cfg.folderPath, name)
			data.Files = append(data.Files, File{
				Name: name,
				Path: path,
			})
		}
	}

	err = t.Execute(w, data)
	if err != nil {
		panic(err)
	}
}
