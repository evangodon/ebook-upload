const wsURI = `ws://${window.location.host}/filewatcher`;

let reloading = false;
async function refreshFileList() {
  reloading = true;

  const res = await fetch("/");
  const html = await res.text();
  const parser = new DOMParser();
  const newDoc = parser.parseFromString(html, "text/html");
  const newFileList = newDoc.querySelector("#file-list");

  const oldFileList = document.querySelector("#file-list");

  oldFileList.innerHTML = newFileList.innerHTML;
}

window.onload = function() {
  const sock = new WebSocket(wsURI);

  sock.onopen = () => {
    console.log(`connected to ${wsURI}`);
  };

  sock.onmessage = (evt) => {
    if (!reloading && evt.data == "reload") {
      refreshFileList();
    }
  };

  sock.onclose = (evt) => {
    console.log(`connection closed "${evt.code}"`);
  };
};
