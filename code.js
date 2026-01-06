// Ambil nama client dari URL
const clientName = new URLSearchParams(window.location.search).get('client');

// Tampilkan nama client di judul
document.getElementById("client-title").textContent = clientName ? `Hi ${clientName}, enjoy your moment!` : "SELF-FOTO-STUDIO";

if(clientName){
  // Fetch data JSON dari Google Apps Script Web App
  fetch("https://script.google.com/macros/s/AKfycbwJy6jXBLHOYz57CJZYV_fWgDGtXJp53YKor7IAZCGmNVKBy67d24yRNuvresXBtVEJ/exec?client=" + clientName)
    .then(res => res.json())
    .then(files => {
      const gallery = document.getElementById("gallery");

      files.forEach(file => {
        const div = document.createElement("div");
        div.className = "item";

        // Preview gambar
        if(file.mime.startsWith("image/")){
          const img = document.createElement("img");
          img.src = file.url;
          img.alt = file.name;
          img.onclick = () => window.open(file.url, "_blank"); // klik → download ukuran penuh
          div.appendChild(img);

        // Preview video
        } else if(file.mime.startsWith("video/")){
          const video = document.createElement("video");
          video.src = file.url;
          video.controls = true;
          div.appendChild(video);
        }

        // Tombol download
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.name;
        a.textContent = "Download";
        div.appendChild(a);

        gallery.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error fetching files:", err);
      document.getElementById("gallery").innerHTML = "<p>Terjadi kesalahan saat memuat file.</p>";
    });

}else{
  document.getElementById("gallery").innerHTML = "<p>Pilih client untuk menampilkan foto/video</p>";
}