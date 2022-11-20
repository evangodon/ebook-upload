const uploadContainer = document.querySelector(".file-upload-container");
const fileInput = document.getElementById("file-upload-input");
const form = document.getElementById("upload-form");
fileInput.addEventListener("change", handleFile);
form.addEventListener("submit", handleSubmit);

function handleFile() {
  const file = this.files[0];

  uploadContainer.innerHTML = `
        <span class="file-name">
          ${file.name}
        </span>
        <button class="upload-btn" type="submit">Upload</button>
      `;
}

function handleSubmit(e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append("ebook-file", fileInput.files[0]);

  const res = fetch("/upload-ebook", {
    body: formData,
    method: "POST",
  });
  res.catch((err) => console.error(err));
}

const dropzone = document.getElementById("drop-zone");
const isHoveringClass = "dropzone-active";
dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  if (!dropzone.classList.contains(isHoveringClass)) {
    dropzone.classList.add(isHoveringClass);
  }
});
dropzone.addEventListener("dragleave", (_) => {
  dropzone.classList.remove(isHoveringClass);
});

const changeEvt = new Event("change");
dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  [...event.dataTransfer.items].forEach((item) => {
    if (item.kind === "file") {
      const file = item.getAsFile();
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;

      fileInput.dispatchEvent(changeEvt);
    }
  });
});
