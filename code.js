const clientName = new URLSearchParams(window.location.search).get('client');
document.getElementById("client-title").textContent = clientName ? `Hi ${clientName}, enjoy your moment!` : "SELF-FOTO-STUDIO";

const gallery = document.getElementById("gallery");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");
const modalDownload = document.getElementById("modal-download");

function openModal(url, name, type) {
  modal.style.display = "flex";
  modalContent.innerHTML = "";
  let media;
  if(type.startsWith("image/")){
    media = document.createElement("img");
  } else if(type.startsWith("video/")){
    media = document.createElement("video");
    media.controls = true;
    media.autoplay = true;
  }
  media.src = url;
  modalContent.appendChild(media);
  modalDownload.href = url;
  modalDownload.download = name;
}

modalClose.onclick = () => { modal.style.display = "none"; }

if(clientName){
  fetch("https://script.google.com/macros/s/AKfycbzUXZiQ-walGMhyotmSHLoku8yuYe4n75-mJtMLEYH4t7zZFIuHvQlkJhi1lqVGhtf2ew/exec?client=" + encodeURIComponent(clientName))
    .then(res => res.json())
    .then(files => {
      gallery.innerHTML = "";
      files.forEach(file => {
        const div = document.createElement("div");
        div.className = "item";

        let thumb;
        if(file.mime.startsWith("image/")){
          thumb = document.createElement("img");
        } else if(file.mime.startsWith("video/")){
          thumb = document.createElement("video");
          thumb.muted = true;
          thumb.loop = true;
          thumb.autoplay = true;
        }
        thumb.src = file.url;
        div.appendChild(thumb);

        const caption = document.createElement("div");
        caption.className = "caption";
        caption.textContent = file.name;
        div.appendChild(caption);

        div.onclick = () => openModal(file.url, file.name, file.mime);

        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.name;
        a.textContent = "Download Full-Size";
        a.style.display = "block";
        a.style.textAlign = "center";
        a.style.marginTop = "5px";
        a.style.color = "blue";
        div.appendChild(a);

        gallery.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error fetching files:", err);
      gallery.innerHTML = "<p>Terjadi kesalahan saat memuat file.</p>";
    });
}else{
  gallery.innerHTML = "<p>Pilih client untuk menampilkan foto/video</p>";
}