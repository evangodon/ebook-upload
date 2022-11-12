const uploadContainer = document.querySelector(".file-upload-container");
const fileInput = document.getElementById("file-upload-input");
let form = document.getElementById("upload-form");
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
  res
    .then(() => {
      location.reload();
    })
    .catch((err) => console.error(err));
}
