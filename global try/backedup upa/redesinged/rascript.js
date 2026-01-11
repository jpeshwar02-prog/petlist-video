document.addEventListener("DOMContentLoaded", () => {
  // Fetch animals.json
  fetch("./animals.json")
    .then(res => res.json())
    .then(data => {
      console.log("All animals loaded:", data);

      // ========================= HORSES =========================
      if (document.querySelector(".cards-container")) {
        renderCards(data, ".cards-container");
      }

      const topStallions = data.filter(a => a.topStallion && a.type === "horse");
      if (document.querySelector(".top-stallion-slider")) {
        renderCards(topStallions, ".top-stallion-slider");
      }

      const newHome = data.filter(a => a.newHome && a.type === "horse");
      if (document.querySelector(".new-home-slider")) {
        renderCards(newHome, ".new-home-slider");
      }

      // ========================= MORE PETS =========================
      const morePetsRaw = data.filter(a => a.morePets && a.type !== "horse");
      const orderedPets = [];
      const dog = morePetsRaw.find(a => a.type === "dog");
      const cat = morePetsRaw.find(a => a.type === "cat");
      const cow = morePetsRaw.find(a => a.type === "cow");

      if (dog) orderedPets.push(dog);
      if (cat) orderedPets.push(cat);
      if (cow) orderedPets.push(cow);

      morePetsRaw.forEach(pet => {
        if (!["dog","cat","cow"].includes(pet.type)) {
          orderedPets.push(pet);
        }
      });

      if (document.querySelector(".more-pets-slider")) {
        renderCards(orderedPets, ".more-pets-slider");
      }

      // ========================= RECENT HORSES =========================
      const horses = data.filter(a => a.type === "horse");
      const recentHorses = horses.slice(0, 4);

      if (document.querySelector(".recent-horse-slider")) {
        renderCards(recentHorses, ".recent-horse-slider");
      }
    })
    .catch(err => console.error("Error loading animals.json:", err));
});
