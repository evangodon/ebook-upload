const wsURI = `ws://${window.location.host}/filewatcher`;

let refreshing = false;
async function refreshFileList() {
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

  sock.onmessage = async (evt) => {
    if (!refreshing && evt.data == "reload") {
      refreshing = true;
      await refreshFileList();
      refreshing = false;
    }
  };

  sock.onclose = (evt) => {
    console.log(`connection closed "${evt.code}"`);
  };
};
