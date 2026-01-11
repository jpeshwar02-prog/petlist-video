document.addEventListener("DOMContentLoaded", () => {
  const cardsPerPage = 12;
  let currentPage = 1;
  let items = [];
  let farms = [];

  const container = document.querySelector(".cards-container");
  const pagination = document.querySelector(".pagination");

  const cityFilter = document.getElementById("cityFilter");
  const bloodlineFilter = document.getElementById("bloodlineFilter");
  const colorFilter = document.getElementById("colorFilter");
  const winnerFilter = document.getElementById("winnerFilter");

  if (!container || !pagination) {
    console.warn("Listing elements missing. Check HTML IDs/classes.");
    return;
  }

  async function loadItems() {
    try {
      const [animalsData, farmsData] = await Promise.all([
        fetch("assets/data/animals.json").then(r => r.json()),
        fetch("assets/data/farms.json").then(r => r.json())
      ]);

      farms = farmsData;

      // ✅ Filter stallions only
      items = animalsData.filter(a =>
        (!a.type || a.type.toLowerCase() === "horse") &&
        a.gender === "stallion"
      );

      console.log("Loaded Stallions:", items);
      populateFilters();
      update();
    } catch (err) {
      console.error("Failed to load JSON:", err);
    }
  }

  function populateFilters() {
    function fillSelect(selectEl, values) {
      const uniqueVals = [...new Set(values.map(v => v?.trim()).filter(Boolean))];
      uniqueVals.forEach(val => {
        const opt = document.createElement("option");
        opt.value = val.toLowerCase();
        opt.textContent = val;
        selectEl.appendChild(opt);
      });
    }

    [cityFilter, bloodlineFilter, colorFilter, winnerFilter].forEach(sel => {
      if (sel && !sel.querySelector('option[value=""]')) {
        const allOpt = document.createElement('option');
        allOpt.value = "";
        allOpt.textContent = "All";
        sel.insertBefore(allOpt, sel.firstChild);
      }
    });

    if (cityFilter) fillSelect(cityFilter, farms.map(f => f.city));
    if (bloodlineFilter) fillSelect(bloodlineFilter, items.map(s => s.attributes?.bloodline));
    if (colorFilter) fillSelect(colorFilter, items.map(s => s.attributes?.color));
    if (winnerFilter) fillSelect(winnerFilter, items.map(s => s.attributes?.winner ? "Yes" : "No"));
  }

  function applyFilters() {
    const cityVal = cityFilter?.value || "";
    const bloodlineVal = bloodlineFilter?.value || "";
    const colorVal = colorFilter?.value || "";
    const winnerVal = winnerFilter?.value || "";

    return items.filter(s => {
         const farm = farms.find(f => f.farmId === s.farmId) || {};
        const win = String(s.attributes?.winner).toLowerCase();
         return (!cityVal || farm.city?.toLowerCase() === cityVal) &&
         (!bloodlineVal || s.attributes?.bloodline?.toLowerCase() === bloodlineVal) &&
         (!colorVal || s.attributes?.color?.toLowerCase() === colorVal) &&
         (!winnerVal || win === winnerVal.toLowerCase());
});

  }

  function renderPage(list, page) {
    container.innerHTML = "";
    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const pagedList = list.slice(start, end);

    // ✅ Use renderCards from shared.js (animals + farms)
    renderCards(pagedList, farms, ".cards-container");

    if (!list.length) {
      const empty = document.createElement("p");
      empty.textContent = "No stallions match the selected filters.";
      empty.style.gridColumn = "1 / -1";
      empty.style.textAlign = "center";
      empty.style.color = "#666";
      container.appendChild(empty);
    }
  }

  function renderPagination(totalItems) {
    pagination.querySelectorAll(".page-btn.number").forEach(btn => btn.remove());
    const totalPages = Math.ceil(totalItems / cardsPerPage);

    const prevBtn = pagination.querySelector(".prev");
    const nextBtn = pagination.querySelector(".next");

    if (totalPages <= 1) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      return;
    } else {
      if (prevBtn) prevBtn.style.display = "";
      if (nextBtn) nextBtn.style.display = "";
    }

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("a");
      btn.href = "#";
      btn.className = "page-btn number" + (i === currentPage ? " active" : "");
      btn.textContent = i;
      btn.addEventListener("click", e => {
        e.preventDefault();
        currentPage = i;
        update();
      });
      pagination.insertBefore(btn, pagination.querySelector(".next"));
    }
  }

  function update() {
    const filtered = applyFilters();
    const totalPages = Math.ceil(filtered.length / cardsPerPage);

    if (totalPages === 0) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    } else if (currentPage < 1) {
      currentPage = 1;
    }

    renderPage(filtered, currentPage);
    renderPagination(filtered.length);
  }

  // ✅ Prev/Next
  const prevBtn = pagination.querySelector(".prev");
  const nextBtn = pagination.querySelector(".next");

  if (prevBtn) {
    prevBtn.addEventListener("click", e => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        update();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", e => {
      e.preventDefault();
      const totalPages = Math.ceil(applyFilters().length / cardsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        update();
      }
    });
  }

  // ✅ Filter change
  [cityFilter, bloodlineFilter, colorFilter, winnerFilter].forEach(f => {
    if (f) {
      f.addEventListener("change", () => {
        currentPage = 1;
        update();
      });
    }
  });

  // ✅ Reset + OK
  const filterSidebar = document.querySelector(".filters-sidebar");
  const filterToggleBtn = document.querySelector(".filter-toggle");

  function resetFilters() {
    [cityFilter, bloodlineFilter, colorFilter, winnerFilter].forEach(f => {
      if (f) f.value = "";
    });
    currentPage = 1;
    update();
  }

  document.querySelector(".filter-reset")?.addEventListener("click", e => {
    e.preventDefault();
    resetFilters();
    if (filterSidebar && filterSidebar.classList.contains("open")) {
      filterSidebar.classList.remove("open");
      filterToggleBtn?.setAttribute("aria-expanded", "false");
    }
  });

  document.querySelector(".filter-ok")?.addEventListener("click", e => {
    e.preventDefault();
    currentPage = 1;
    update();
    if (filterSidebar && filterSidebar.classList.contains("open")) {
      filterSidebar.classList.remove("open");
      filterToggleBtn?.setAttribute("aria-expanded", "false");
    }
  });

  loadItems(); // 🚀 init
});

// ✅ Mobile filter toggle
const filterToggleBtn = document.querySelector(".filter-toggle");
const filterSidebar = document.querySelector(".filters-sidebar");

if (filterToggleBtn && filterSidebar) {
  filterToggleBtn.addEventListener("click", () => {
    const expanded = filterToggleBtn.getAttribute("aria-expanded") === "true";
    filterToggleBtn.setAttribute("aria-expanded", !expanded);
    filterSidebar.classList.toggle("open");
  });
}
