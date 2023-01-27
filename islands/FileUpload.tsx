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

  function handleAddFile() {
    // TODO: fetch request to POST file
  }

  return (
    <div
      class={dropzoneActive ? "dropzone-active" : "dropzone"}
      onDragEnter={toggleDropzoneActive}
      onDragLeave={toggleDropzoneActive}
      onDragOver={preventDefault}
      onDrop={handleDrop}
    >
      <form class="file-upload-container" onSubmit={preventDefault}>
        {file
          ? (
            <div>
              <span>{file.name}</span>
              <button onClick={handleAddFile}>Add</button>
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
