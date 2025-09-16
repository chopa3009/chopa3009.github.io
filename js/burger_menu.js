document.addEventListener("DOMContentLoaded", function () {
  // Load burger menu
  fetch("burger_menu.html")
    .then((r) => r.text())
    .then((data) => {
      document.getElementById("burger-menu").innerHTML = data;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      const serviceLink = document.querySelector('.frame_burger a[href="#services-desktop"]');
      const portfolioLink = document.querySelector('.frame_burger a[href="#portfolio-desktop"]');
      const contactsLink = document.querySelector('.frame_burger a[href="#contacts-desktop"]');

      // Adjust Services & Portfolio links if not on index.html
      if (currentPage !== "index.html") {
        if (serviceLink) serviceLink.setAttribute("href", "index.html#services-desktop");
        if (portfolioLink) portfolioLink.setAttribute("href", "index.html#portfolio-desktop");
      } else {
        if (serviceLink) serviceLink.setAttribute("href", "#services-desktop");
        if (portfolioLink) portfolioLink.setAttribute("href", "#portfolio-desktop");
      }

      // Smooth scroll for contacts in burger menu
      if (contactsLink) {
        contactsLink.addEventListener("click", (e) => {
          e.preventDefault();
          const target = document.getElementById("contacts-desktop");
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            closeBurger(); // close burger after click
          }
        });
      }

      // Burger menu click handler
      const burgerMenu = document.querySelector(".frame_burger");
      if (!burgerMenu) return;

      burgerMenu.addEventListener("click", (e) => {
        const isLink = e.target.closest("a");
        const isClose = e.target.closest(".close-button");
        const isSubmenuToggle = isLink && isLink.getAttribute("href") === "javascript:void(0);";

        if ((isLink && !isSubmenuToggle) || isClose) {
          closeBurger();
        }
      });

      // Language highlighting
      const path = window.location.pathname;
      const langLinks = document.querySelectorAll(".frame_burger .lang-container");
      if (langLinks && langLinks.length >= 2) {
        if (path.startsWith("/en/")) {
          langLinks[1].classList.add("active"); // EN
        } else {
          langLinks[0].classList.add("active"); // UA
        }
      }
    })
    .catch((err) => console.error("Burger menu load error:", err));
});

// Burger open/close functions
function closeBurger() {
  const burger = document.querySelector(".frame_burger");
  if (burger) burger.style.display = "none";
  document.body.classList.remove("menu-open");

  const submenu = document.getElementById("services-submenu");
  if (submenu) {
    submenu.classList.remove("show");
    submenu.classList.add("hidden");
  }
}

function openBurger() {
  const burger = document.querySelector(".frame_burger");
  if (burger) burger.style.display = "flex";
  document.body.classList.add("menu-open");
}

// Language switch
let path = window.location.pathname;
function switchLanguage(toLang) {
  if (toLang === "en") {
    if (!path.startsWith("/en/")) {
      const newPath = "/en" + path;
      window.location.href = newPath;
    }
  } else {
    if (path.startsWith("/en/")) {
      const newPath = path.replace(/^\/en/, "");
      window.location.href = newPath;
    }
  }
}

// Toggle Services submenu
function toggleSubmenu() {
  const submenu = document.getElementById("services-submenu");
  if (submenu) {
    submenu.classList.toggle("show");
    submenu.classList.toggle("hidden");
  }
}
