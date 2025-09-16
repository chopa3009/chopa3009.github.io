document.addEventListener("DOMContentLoaded", function () {
  // Load burger menu
  fetch("burger_menu.html")
    .then((r) => r.text())
    .then((data) => {
      document.getElementById("burger-menu").innerHTML = data;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";
 const serviceLink = document.querySelector(
        '.frame_burger a[href="#services-desktop"]'
      );
      const portfolioLink = document.querySelector(
        '.frame_burger a[href="#portfolio-desktop"]'
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
      // Тепер елемент frame_burger точно є в DOM
      const burgerMenu = document.querySelector(".frame_burger");
      if (!burgerMenu) return;

burgerMenu.addEventListener("click", (e) => {
  // if clicked element is an <a> OR the close button
  const isLink = e.target.closest("a");
  const isClose = e.target.closest(".close-button");

  // but ignore links that are only toggling submenu
  const isSubmenuToggle = isLink && isLink.getAttribute("href") === "javascript:void(0);";

  if ((isLink && !isSubmenuToggle) || isClose) {
    closeBurger();
  }
});
const path = window.location.pathname; // full path, e.g., "/index.html" or "/en/index.html"
const langLinks = document.querySelectorAll(".frame_burger .lang-container");

if (langLinks && langLinks.length >= 2) {
  // Pages in /en/ → EN
  if (path.startsWith("/en/")) {
    langLinks[1].classList.add("active"); // EN
  } else {
    // Any other page in root → UA
    langLinks[0].classList.add("active"); // UA
  }
}

    })
    .catch((err) => console.error("Burger menu load error:", err));
});

function closeBurger() {
  document.querySelector(".frame_burger").style.display = "none";
  document.body.classList.remove("menu-open");
  const submenu = document.getElementById("services-submenu");
  submenu.classList.remove("show");
  submenu.classList.add("hidden");
}
function openBurger() {
  document.querySelector(".frame_burger").style.display = "flex";
  document.body.classList.add("menu-open");
}

let path = window.location.pathname;
  function switchLanguage(toLang) {
    if (toLang === "en") {
      if (!path.startsWith("/en/")) {
        // Add /en/ before filename
        const newPath = "/en" + path;
        window.location.href = newPath;
      }
    } else {
      if (path.startsWith("/en/")) {
        // Remove /en/ from path

        const newPath = path.replace(/^\/en/, "");
        window.location.href = newPath;
      }
    }
  }
function toggleSubmenu() {
  const submenu = document.getElementById("services-submenu");
  submenu.classList.toggle("show");
  submenu.classList.toggle("hidden");
}

