document.addEventListener("DOMContentLoaded", function () {
  // Load header
  fetch("header.html")
    .then((r) => r.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";

      // Links
      const serviceLink = document.querySelector('.header a[href="#services-desktop"]');
      const portfolioLink = document.querySelector('.header a[href="#portfolio-desktop"]');
      const contactsLink = document.querySelector('.header a[href="#contacts-desktop"]');

      // Adjust Services & Portfolio links only if not on index.html
      if (currentPage !== "index.html") {
        if (serviceLink) serviceLink.setAttribute("href", "index.html#services-desktop");
        if (portfolioLink) portfolioLink.setAttribute("href", "index.html#portfolio-desktop");
      }

      // Smooth scroll for Contacts on all pages
      if (contactsLink) {
        contactsLink.addEventListener("click", (e) => {
          e.preventDefault();
          const target = document.getElementById("contacts-desktop");
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }

      // Language highlighting
      const path = window.location.pathname;
      const langLinks = document.querySelectorAll(".header-action-language div");
      if (langLinks && langLinks.length >= 2) {
        if (path.startsWith("/en/")) {
          langLinks[0].classList.add("active"); // EN
        } else {
          langLinks[1].classList.add("active"); // UA
        }
      }

      // Dropdown menus
      const dropdowns = document.querySelectorAll(".dropdown");
      dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector(".dropdown-toggle");
        toggle.addEventListener("click", (e) => {
          e.preventDefault();
          dropdowns.forEach(d => { if (d !== dropdown) d.classList.remove("active"); });
          dropdown.classList.toggle("active");
        });
      });

      document.addEventListener("click", (e) => {
        dropdowns.forEach(dropdown => {
          if (!dropdown.contains(e.target)) dropdown.classList.remove("active");
        });
      });
    })
    .catch((err) => console.error("Header load error:", err));
});
