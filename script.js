/* --------------------------------------------------
   REVEAL ON SCROLL
-------------------------------------------------- */
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");

  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 120;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add("show");
    } else {
      el.classList.remove("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* --------------------------------------------------
   NAV MENU (mobile toggle)
-------------------------------------------------- */
const menuBtn = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-list");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

/* --------------------------------------------------
   VIDEO FILTERING + PAGINATION
-------------------------------------------------- */
const cards = Array.from(document.querySelectorAll(".card"));
const filterButtons = document.querySelectorAll(".filter-btn");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const itemsPerPage = 6;
let currentCategory = "all";

// Function to render videos
function renderVideos() {
  // Filter by category
  let filtered = currentCategory === "all" 
    ? cards 
    : cards.filter(card => card.dataset.category === currentCategory);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  currentPage = Math.min(currentPage, totalPages);

  filtered.forEach((card, index) => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    if (index >= start && index < end) {
      card.style.display = "block";
      card.style.opacity = 1;
      card.style.transition = "opacity 0.4s ease";
    } else {
      card.style.display = "none";
    }
  });

  // Update pagination controls
  pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Pagination events
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderVideos();
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  renderVideos();
});

// Filter button events
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    currentPage = 1; // reset to first page
    renderVideos();
  });
});

// Initial render
renderVideos();

/* --------------------------------------------------
   OPTIONAL: SWIPER (if you use sliders elsewhere)
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".mySwiper")) {
    new Swiper(".mySwiper", {
      loop: true,
      spaceBetween: 20,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }
});
