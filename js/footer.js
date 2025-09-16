document.addEventListener("DOMContentLoaded", function () {
  // Load footer
  fetch("footer.html")
    .then((r) => r.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";

      // Links to Services & Portfolio
      const serviceLink = document.querySelector('.footer a[href="#services-desktop"]');
      const portfolioLink = document.querySelector('.footer a[href="#portfolio-desktop"]');
      const contactsLink = document.querySelector('.footer a[href="#contacts-desktop"]');

      // Adjust Services & Portfolio links if not on index.html
      if (currentPage !== "index.html") {
        if (serviceLink) serviceLink.setAttribute("href", "index.html#services-desktop");
        if (portfolioLink) portfolioLink.setAttribute("href", "index.html#portfolio-desktop");
      } else {
        if (serviceLink) serviceLink.setAttribute("href", "#services-desktop");
        if (portfolioLink) portfolioLink.setAttribute("href", "#portfolio-desktop");
      }

      // Smooth scroll for Contacts
      if (contactsLink) {
        contactsLink.addEventListener("click", (e) => {
          e.preventDefault();
          const target = document.getElementById("contacts-desktop");
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }

      // Set current year
      const yearSpan = document.getElementById("currentYear");
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
      }
    })
    .catch((err) => console.error("Footer load error:", err));
});
