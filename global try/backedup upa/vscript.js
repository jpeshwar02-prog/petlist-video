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
   MAIN SCRIPT (runs after DOM ready)
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  /* NAV MENU (mobile toggle) */
  const menuBtn = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-list");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  /* VIDEO FILTERING + PAGINATION */
  const cards = Array.from(document.querySelectorAll(".card"));
  const filterButtons = document.querySelectorAll(".filter-btn");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");

  let currentPage = 1;
  const itemsPerPage = 6;
  let currentCategory = "all";

  function getFilteredCards() {
    if (currentCategory === "all") return cards;
    return cards.filter(card => card.dataset.category === currentCategory);
  }

  function renderVideos() {
    const filtered = getFilteredCards();
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    // Hide all
    cards.forEach(card => { card.style.display = "none"; });

    // Show current slice
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    filtered.slice(start, end).forEach(card => {
      card.style.display = "block";
    });

    // Update pagination
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
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
    btn.setAttribute("type", "button"); // prevent accidental form submit
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      currentPage = 1;
      renderVideos();
    });
  });

  // Initial render
  renderVideos();

  /* OPTIONAL: SWIPER */
  if (document.querySelector(".mySwiper")) {
    new Swiper(".mySwiper", {
      loop: true,
      spaceBetween: 20,
      autoplay: { delay: 2500, disableOnInteraction: false },
      pagination: { el: ".swiper-pagination", clickable: true },
    });
  }
});
