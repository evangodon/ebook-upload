package main

import (
	"io/ioutil"
	"net/http"
	"path"
	"text/template"
)

type File struct {
	Name string
	Path string
}

type Data struct {
	Files      []File
	FolderPath string
}

// GET homepage
func (app application) getHomePage() func(w http.ResponseWriter, r *http.Request) {
	tmpl, err := static.ReadFile("static/index.html")
	if err != nil {
		panic(err)
	}

	t, err := template.New("homepage").Parse(string(tmpl))
	if err != nil {
		panic(err)
	}

	return func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
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
}

// GET file from folder
func (app application) getFile() http.Handler {
	fs := http.FileServer(http.Dir(app.cfg.folderPath))

	return fs
}
