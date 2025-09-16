document.addEventListener("DOMContentLoaded", function () {
  // Load header
  fetch("header.html")
    .then((r) => r.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;

      const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

      // Посилання на "Послуги" та "Наші роботи"
      const serviceLink = document.querySelector(
        '.header a[href="#services-desktop"]'
      );
      const portfolioLink = document.querySelector(
        '.header a[href="#portfolio-desktop"]'
      );

      if (currentPage !== "index.html") {
        if (serviceLink)
          serviceLink.setAttribute("href", "index.html#services-desktop");
        if (portfolioLink)
          portfolioLink.setAttribute("href", "index.html#portfolio-desktop");
      } else {
        if (serviceLink) serviceLink.setAttribute("href", "#services-desktop");
        if (portfolioLink)
          portfolioLink.setAttribute("href", "#portfolio-desktop");
      }

      // Підсвічування мови після вставки header
      const path = window.location.pathname; // full path, e.g., "/index.html" or "/en/about.html"
      const langLinks = document.querySelectorAll(
        ".header-action-language div"
      );

      if (!langLinks || langLinks.length < 2) return;

      // If path starts with /en/ → EN
      if (path.startsWith("/en/")) {
        langLinks[0].classList.add("active"); // EN
      } else {
        // Any other path in root → UA
        langLinks[1].classList.add("active"); // UA
      }
 const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      // Закриваємо інші меню
      dropdowns.forEach(d => {
        if (d !== dropdown) d.classList.remove("active");
      });
      // Перемикаємо активність
      dropdown.classList.toggle("active");
    });
  });

  // Закриває підменю при кліку поза ним
  document.addEventListener("click", (e) => {
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("active");
      }
    });
  });
      // Normalize path: remove double slashes just in case
    })
    .catch((err) => console.error("Header load error:", err));
});
