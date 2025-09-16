document.addEventListener("DOMContentLoaded", function() {
  // Load modal popup
  fetch("modal_popup.html")
    .then(r => r.text())
    .then(data => {
      document.getElementById("modal-popup").innerHTML = data;

      // Run title update after DOM insertion
      const currentPage = window.location.pathname.split("/").pop();
      if (currentPage === "shop.html") {
        const modalTitle = document.querySelector("#modal-popup .modal-title");
        if (modalTitle) {
          const lang = document.documentElement.lang; // "en" or "ua"
          modalTitle.textContent =
            lang === "en"
              ? "Order Information"
              : "Інформація щодо замовлення";
        }
      }
    })
    .catch(err => console.error("Modal popup load error:", err));
});
