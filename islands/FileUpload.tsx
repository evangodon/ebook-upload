import { useState } from "preact/hooks";

const fileUploadInput = "file-upload-input";

type Props = {};

export default function FileUpload({}: Props) {
  const [dropzoneActive, setDropzoneActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  function toggleDropzoneActive() {
    setDropzoneActive(!dropzoneActive);
  }

  function preventDefault(e: Event) {
    e.preventDefault();
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e?.dataTransfer?.files) {
      setFile(e.dataTransfer.files[0]);
    }
  }

  async function handleAddFile() {
    if (file) {
      const formData = new FormData();
      const ebookBlob = new Blob([file!]);
      formData.set("ebook", ebookBlob, file.name);

      const res = await fetch("/", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setFile(null);
        setDropzoneActive(false);
        location.reload();
      }
      const msg = await res.json();
      console.error(msg);
    }
  }

  return (
    <div
      class={`dropzone ${dropzoneActive ? "dropzone-active" : ""}`}
      onDragEnter={toggleDropzoneActive}
      onDragLeave={toggleDropzoneActive}
      onDragOver={preventDefault}
      onDrop={handleDrop}
    >
      <form class="file-upload-container" onSubmit={preventDefault}>
        {file
          ? (
            <div class="file-added">
              <span class="ebook-name">{file.name}</span>
              <button class="submit-button" onClick={handleAddFile}>
                Add
              </button>
            </div>
          )
          : (
            <>
              <label for={fileUploadInput} class="file-input-label">
                New Ebook
              </label>
              <input
                type="file"
                name="ebook-file"
                class="file-input"
                id={fileUploadInput}
                accept=".epub,.pdf"
                required
              />
            </>
          )}
      </form>
    </div>
  );
}
