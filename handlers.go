package main

import (
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"sort"
	"text/template"
	"time"
)

type File struct {
	Name         string
	Path         string
	LastModified time.Time
	IsNew        bool
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

		now := time.Now()
		for _, file := range files {
			if !file.IsDir() {
				name := file.Name()
				path := path.Join(app.cfg.folderPath, name)
				data.Files = append(data.Files, File{
					Name:         name,
					Path:         path,
					LastModified: file.ModTime(),
					IsNew:        file.ModTime().After(now.Add(-10 * time.Minute)),
				})
			}
		}

		sort.SliceStable(data.Files, func(i, j int) bool {
			return data.Files[i].LastModified.After(data.Files[j].LastModified)
		})

		err = t.Execute(w, data)
		if err != nil {
			panic(err)
		}
	}
}

// GET file from folder
func (app application) getFile() http.Handler {
	fs := http.FileServer(http.Dir(app.cfg.folderPath))
	return http.StripPrefix(app.cfg.folderPath, fs)
}

func (app application) postEbook() func(w http.ResponseWriter, r *http.Request) {

	return func(w http.ResponseWriter, r *http.Request) {

		err := r.ParseMultipartForm(32 << 20)
		if err != nil {
			log.Fatal("error parsing form " + err.Error())
		}

		f, h, err := r.FormFile("ebook-file")
		if err != nil {
			log.Fatal("error getting file " + err.Error())
		}
		defer f.Close()

		filepath := app.cfg.folderPath + h.Filename
		file, err := os.OpenFile(
			filepath,
			os.O_WRONLY|os.O_CREATE,
			os.ModePerm,
		)
		if err != nil {
			log.Fatal("error opening new  file " + err.Error())
		}
		defer file.Close()

		_, err = io.Copy(file, f)
		if err != nil {
			log.Fatal("error copying contents to new file " + err.Error())
		}

		log.Print("Wrote new file to " + filepath)

		io.WriteString(w, "upload successful")
	}
}
