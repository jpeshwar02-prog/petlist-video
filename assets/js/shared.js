/**
 * Render cards into a container
 * @param {Array} animals - Array of animal objects
 * @param {Array} farms - Array of farm objects
 * @param {String} containerSelector - CSS selector for container
 * @param {Number} limit - Maximum number of cards to render
 */
function renderCards(animals, farms, containerSelector, limit = null) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = "";

  if (!animals || animals.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No animals available for this section.";
    empty.style.gridColumn = "1 / -1";
    empty.style.textAlign = "center";
    empty.style.color = "#666";
    container.appendChild(empty);
    return;
  }

  const farmsMap = farms.reduce((map, f) => {
    map[f.farmId] = f;
    return map;
  }, {});

  // Apply limit if provided
  const limitedAnimals = limit ? animals.slice(0, limit) : animals;

  limitedAnimals.forEach(animal => {
    const farm = farmsMap[animal.farmId] || {};
    const card = document.createElement("article");
    card.className = "stallion-card"; // keep your CSS class

    let extraFields = "";
    if (animal.type === "dog" && animal.line) {
      extraFields += `<p><i class="fa-solid fa-dog"></i> Line: <span>${animal.line}</span></p>`;
    }
    if (animal.type === "cow" && (animal.attributes?.purpose || []).includes("milk")) {
      extraFields += `<p><i class="fa-solid fa-cow"></i> Purpose: <span>Milk Production</span></p>`;
    }

    const img =
      animal.media?.images?.img1 ||
      animal.media?.images?.img2 ||
      animal.media?.images?.img3 ||
      "assets/images/placeholder-animal.jpg";

    card.innerHTML = `
      <div class="stallion-image">
        <img src="${img}" alt="${animal.name}">
      </div>
      <div class="stallion-details">
        <div class="details-content">
          <h3 class="animal-name">${animal.name}</h3>
          <p><i class="fa-solid fa-user"></i> Owner: <span>${farm.owner || "—"}</span></p>
          <p><i class="fa-solid fa-tractor"></i> Farm: <span>${farm.name || "—"}</span></p>
          <p><i class="fa-solid fa-map-location-dot"></i> District: <span>${farm.city || "—"}</span></p>
          ${extraFields}
        </div>
        <div class="details-footer">
          <a href="singlelist.html?farmId=${animal.farmId}&animalId=${animal.animalId}" class="details-btn">
            Show Details
          </a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    fetch("assets/data/animals.json").then(r => r.json()),
    fetch("assets/data/farms.json").then(r => r.json())
  ])
    .then(([animals, farms]) => {
      console.log("Animals loaded:", animals);
      console.log("Farms loaded:", farms);

      const topStallions = animals.filter(a => a.attributes?.topStallion);
      const newHome = animals.filter(a => a.attributes?.newHome);
      const morePets = animals.filter(a => a.attributes?.morePets);

      // Recent horses: only type=horse, sorted by createdAt, max 6
      const recent = animals
        .filter(a => a.type === "horse")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

      renderCards(topStallions, farms, ".top-stallion-slider", 4);
      renderCards(newHome, farms, ".new-home-slider", 4);
      renderCards(morePets, farms, ".more-pets-slider", 4);
      renderCards(recent, farms, ".recent-horse-slider", 4);
    })
    .catch(err => {
      console.error("Failed to load data", err);
    });
});
