document.addEventListener("DOMContentLoaded", function () {
  // Load header
  fetch("header.html")
    .then((r) => r.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";

      // Посилання на "Послуги" та "Наші роботи"
      const serviceLink = document.querySelector('.header a[href="#services-desktop"]');
      const portfolioLink = document.querySelector('.header a[href="#portfolio-desktop"]');

      if (currentPage !== "index.html") {
        if (serviceLink) serviceLink.setAttribute("href", "index.html#services-desktop");
        if (portfolioLink) portfolioLink.setAttribute("href", "index.html#portfolio-desktop");
      } else {
        if (serviceLink) serviceLink.setAttribute("href", "#services-desktop");
        if (portfolioLink) portfolioLink.setAttribute("href", "#portfolio-desktop");
      }

      // Підсвічування мови після вставки header
  const path = window.location.pathname; // full path, e.g., "/index.html" or "/en/about.html"
  const langLinks = document.querySelectorAll(".header-action-language a");

  if (!langLinks || langLinks.length < 2) return;

  // If path starts with /en/ → EN
  if (path.startsWith("/en/")) {
    langLinks[0].classList.add("active"); // EN
    console.log("EN active header");
  } else {
    // Any other path in root → UA
    langLinks[1].classList.add("active"); // UA
    console.log("UA active header");
  }

 // Normalize path: remove double slashes just in case
 function normalize(url) {
   return url.replace(/\/{2,}/g, '/');
 }
 // EN link: only add "/en" if it’s not already there
 let enPath = path.startsWith("/en/") ? path : "/en" + path;
 document.getElementById("en-link").href = normalize(enPath);
 // UA link: remove the first "/en" if it exists
 let uaPath = path.startsWith("/en/") ? path.replace(/^\/en/, "") : path;
 document.getElementById("ua-link").href = normalize(uaPath);
    })
    .catch((err) => console.error("Header load error:", err));
});
