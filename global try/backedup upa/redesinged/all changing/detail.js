document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  if (!id) return;

  fetch("./animals.json")
    .then(res => res.json())
    .then(data => {
      const animal = data.find(a => a.id === id);
      if (!animal) return;

      // Hero
      const hero = document.getElementById("detail-hero");
      document.getElementById("animal-name").textContent = animal.name;
      document.getElementById("animal-subtitle").textContent = `${animal.breed} ${animal.gender}`;
      if (animal.media?.images?.[0]) {
        hero.style.backgroundImage = `url(${animal.media.images[0]})`;
        hero.style.backgroundSize = "cover";
        hero.style.backgroundPosition = "center";
      }

      // Gallery images
      const images = Array.isArray(animal.media?.images) ? animal.media.images.slice(0, 3) : [];
      const mainImage = document.getElementById("main-image");
      const thumbs = document.getElementById("thumbs");

      const primary = images[0] || "";
      mainImage.src = primary;
      mainImage.alt = animal.name;

      thumbs.innerHTML = "";
      images.forEach((src, i) => {
        const t = document.createElement("img");
        t.src = src;
        t.alt = `${animal.name} thumbnail ${i + 1}`;
        t.loading = "lazy";
        t.decoding = "async";
        thumbs.appendChild(t);
      });

      // Video
      const videoEl = document.getElementById("video");
      const embed = getYouTubeEmbed(animal.media?.video);
      if (embed) {
        videoEl.src = embed;
      } else {
        document.querySelector(".video-frame").style.display = "none";
      }

      // General Details
      document.getElementById("general-details").innerHTML = `
        <li><i class="fas fa-check-circle"></i><span class="tick-label">Breed:</span><span class="tick-value">${animal.breed}</span></li>
        <li><i class="fas fa-check-circle"></i><span class="tick-label">Gender:</span><span class="tick-value">${animal.gender}${animal.gelded ? " (Gelded)" : ""}</span></li>
        <li><i class="fas fa-check-circle"></i><span class="tick-label">Age:</span><span class="tick-value">${animal.age}</span></li>
        ${animal.height ? `<li><i class="fas fa-check-circle"></i><span class="tick-label">Height:</span><span class="tick-value">${animal.height}</span></li>` : ""}
        ${animal.color ? `<li><i class="fas fa-check-circle"></i><span class="tick-label">Color:</span><span class="tick-value">${animal.color}</span></li>` : ""}
        ${animal.bloodline ? `<li><i class="fas fa-check-circle"></i><span class="tick-label">Bloodline:</span><span class="tick-value">${animal.bloodline}</span></li>` : ""}
      `;

      // Work & Activities
      let purposeItems = [];
      if (Array.isArray(animal.purpose)) {
        if (animal.purpose.includes("ride")) purposeItems.push("Ride");
        if (animal.purpose.includes("buggy")) purposeItems.push("Buggy");
      }
      document.getElementById("work-details").innerHTML = `
        <li><i class="fas fa-horse"></i><span class="tick-label">Purpose:</span>
            <span class="tick-value">${purposeItems.join(", ") || "N/A"}</span></li>
        ${animal.dance ? `<li><i class="fas fa-music"></i><span class="tick-label">Dance:</span><span class="tick-value">Yes</span></li>` : ""}
        <li><i class="fas fa-star"></i><span class="tick-label">Stud Service:</span><span class="tick-value">${animal.studAvailable ? "Available" : "Not Available"}</span></li>
        <li><i class="fas fa-graduation-cap"></i><span class="tick-label">Show Trained:</span><span class="tick-value">${animal.showTrained ? "Yes" : "No"}</span></li>
      `;

      // Specific Details
      document.getElementById("specific-details").innerHTML = `
        ${animal.legBlaze ? `<li><i class="fas fa-shoe-prints"></i><span class="tick-label">Leg Blaze:</span><span class="tick-value">${animal.legBlaze}</span></li>` : ""}
        ${animal.hairWhorl ? `<li><i class="fas fa-water"></i><span class="tick-label">Hair Whorl:</span><span class="tick-value">${animal.hairWhorl}</span></li>` : ""}
        ${typeof animal.winner !== "undefined" ? `<li><i class="fas fa-medal"></i><span class="tick-label">Show Winner:</span><span class="tick-value">${animal.winner ? "Yes" : "No"}</span></li>` : ""}
        ${animal.clubRegister ? `<li><i class="fas fa-id-card"></i><span class="tick-label">Club Register:</span><span class="tick-value">Yes</span></li>` : ""}
      `;

      // Farm Details
      document.getElementById("farm-details").innerHTML = `
        <li><i class="fas fa-user"></i> Owner: <strong>${animal.owner}</strong></li>
        <li><i class="fas fa-map-marker-alt"></i> Location: <strong>${animal.city}</strong></li>
        <li><i class="fas fa-home"></i> Farm: <strong>${animal.ranch}</strong></li>
      `;

      // Contact link
      const contactLink = document.getElementById("contact-link");
      contactLink.href = `contact.html?farm=${encodeURIComponent(animal.farmId || animal.ranch)}`;

      // Related animals
      let sameFarm = data.filter(a => a.id !== animal.id && a.farmId === animal.farmId);
      let sameColor = data.filter(a => a.id !== animal.id && a.color === animal.color);

      function pickRandom(arr, n) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
      }

      const relatedAnimals = [
        ...pickRandom(sameFarm, 2),
        ...pickRandom(sameColor, 2)
      ];

      if (relatedAnimals.length) {
        renderCards(relatedAnimals, "#related-slider");
      } else {
        document.querySelector("#related-slider").innerHTML = `<p class="muted">No related animals found.</p>`;
      }

      // ================= Modal / Lightbox Setup =================
      const modal = document.getElementById("lightboxModal");
      const modalImg = document.getElementById("lightboxImage");
      const modalVideo = document.getElementById("lightboxVideo");
      const closeBtn = modal.querySelector(".close");
      const prevBtn = modal.querySelector(".prev");
      const nextBtn = modal.querySelector(".next");
      const zoomBtn = document.getElementById("zoom-btn");

      const thumbsEls = Array.from(document.querySelectorAll("#thumbs img"));
      const galleryItems = [];
      if (mainImage.src) galleryItems.push({ type: "image", src: mainImage.src });
      thumbsEls.forEach(img => galleryItems.push({ type: "image", src: img.src }));
      if (videoEl.src) galleryItems.push({ type: "video", src: videoEl.src });

      let currentIndex = 0;

      function openModal() {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
      function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        modalVideo.src = ""; // stop playback
      }
      function showItem(index) {
  const item = galleryItems[index];
  if (!item) return;
  modalImg.style.display = "none";
  modalVideo.style.display = "none";

  if (item.type === "image") {
    modalImg.src = item.src;
    modalImg.style.display = "block";
  } else {
    modalVideo.src = item.src;
    modalVideo.style.display = "block";
    modalVideo.style.width = "90vw";   // ✅ enforce size
    modalVideo.style.height = "70vh";
  }
  currentIndex = index;
  openModal();
}


            // Click bindings
      if (zoomBtn) zoomBtn.onclick = () => showItem(0);
      mainImage.onclick = () => showItem(0);
      thumbsEls.forEach((img, i) => img.onclick = () => showItem(i + 1));
      if (videoEl.src) videoEl.onclick = () => showItem(galleryItems.length - 1);

      // Controls
      closeBtn.onclick = closeModal;
      prevBtn.onclick = () => showItem((currentIndex - 1 + galleryItems.length) % galleryItems.length);
      nextBtn.onclick = () => showItem((currentIndex + 1) % galleryItems.length);

      // Keyboard + backdrop
      window.addEventListener("keydown", e => {
        if (!modal.classList.contains("open")) return;
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowLeft") prevBtn.click();
        if (e.key === "ArrowRight") nextBtn.click();
      });
      modal.addEventListener("click", e => {
        if (e.target === modal) closeModal();
      });

      // ================= Relocation Logic =================
      const leftPanel  = document.querySelector(".left-panel");
      const rightPanel = document.querySelector(".right-panel");
      const imagePanel = document.querySelector(".image-panel");
      const videoFrame = document.querySelector(".video-frame");

      if (leftPanel && rightPanel && imagePanel && videoFrame) {
        const mq = window.matchMedia("(max-width: 540px)");

        function relocateVideo(e) {
          if (e.matches) {
            // Mobile: move video below image panel
            if (videoFrame.parentElement !== leftPanel) {
              imagePanel.insertAdjacentElement("afterend", videoFrame);
            }
          } else {
            // Desktop: restore video to top of right panel
            if (videoFrame.parentElement !== rightPanel) {
              rightPanel.insertBefore(videoFrame, rightPanel.firstElementChild);
            }
          }
        }

        relocateVideo(mq);                 // initial placement
        mq.addEventListener("change", relocateVideo); // respond to resize
      }
    })
    .catch(err => console.error("Error loading animals.json:", err));
});

// Helper: normalize any YouTube URL into embed form
function getYouTubeEmbed(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.searchParams.get("v")) return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    if (u.pathname.includes("/embed/")) return url;
  } catch {}
  return "";
}
