/**
 * Render cards into a container
 * @param {Array} list - Array of animal objects
 * @param {String} containerSelector - CSS selector for container
 */
function renderCards(list, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  // Clear previous cards
  container.innerHTML = "";

  // Empty state
  if (!list || list.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No animals available for this section.";
    empty.style.gridColumn = "1 / -1";
    empty.style.textAlign = "center";
    empty.style.color = "#666";
    container.appendChild(empty);
    return;
  }

  list.forEach(animal => {
    const card = document.createElement("article");
    card.className = "stallion-card";

    // Extra fields for dogs/cows
    let extraFields = "";
    if (animal.type === "dog" && animal.line) {
      extraFields += `<p><i class="fa-solid fa-dog"></i> Line: <span>${animal.line}</span></p>`;
    }
    if (animal.type === "cow" && animal.purpose?.includes("milk")) {
      extraFields += `<p><i class="fa-solid fa-cow"></i> Purpose: <span>Milk Production</span></p>`;
    }

    // Card markup
    card.innerHTML = `
      <div class="stallion-image">
        <img src="${animal.media.images[0]}" alt="${animal.name}">
      </div>
      <div class="stallion-details">
        <div class="details-content">
          <h3 class="animal-name">${animal.name}</h3>
          <p><i class="fa-solid fa-user"></i> Owner: <span>${animal.owner}</span></p>
          <p><i class="fa-solid fa-tractor"></i> Farm: <span>${animal.ranch}</span></p>
          <p><i class="fa-solid fa-map-location-dot"></i> District: <span>${animal.city}</span></p>
          ${extraFields}
        </div>
        <div class="details-footer">
          <a href="singlelist.html?id=${animal.id}" class="details-btn">Show Details</a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}
