package main

import (
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
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

		var files []File

		now := time.Now()
		filepath.WalkDir(app.cfg.folderPath, func(s string, d fs.DirEntry, e error) error {
			if e != nil {
				return e
			}
			info, e := d.Info()
			if e != nil {
				return e
			}

			if d.IsDir() {
				return nil
			}

			files = append(files, File{
				Name:         d.Name(),
				Path:         s,
				LastModified: info.ModTime(),
				IsNew:        info.ModTime().After(now.Add(-10 * time.Minute)),
			})

			return nil
		})

		sort.SliceStable(files, func(i, j int) bool {
			return files[i].LastModified.After(files[j].LastModified)
		})

		data := Data{
			Files:      files,
			FolderPath: app.cfg.folderPath,
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
