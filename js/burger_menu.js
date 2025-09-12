document.addEventListener("DOMContentLoaded", function () {
  // Load burger menu
  fetch("burger_menu.html")
    .then((r) => r.text())
    .then((data) => {
      document.getElementById("burger-menu").innerHTML = data;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Посилання на "Послуги" та "Наші роботи"
  const serviceLink = document.querySelector('.frame_burger a[href="#services-desktop"]');
  const portfolioLink = document.querySelector('.frame_burger a[href="#portfolio-desktop"]');

  if (currentPage !== "index.html") {
    if (serviceLink) serviceLink.setAttribute("href", "home.html#services-desktop");
    if (portfolioLink) portfolioLink.setAttribute("href", "home.html#portfolio-desktop");
  } else {
    if (serviceLink) serviceLink.setAttribute("href", "#services-desktop");
    if (portfolioLink) portfolioLink.setAttribute("href", "#portfolio-desktop");
  }

      // Тепер елемент frame_burger точно є в DOM
      const burgerMenu = document.querySelector(".frame_burger");
      if (!burgerMenu) return;

      burgerMenu.addEventListener("click", (e) => {
        if (e.target.closest("a") || e.target.closest(".close-button")) {
          closeBurger();
        }
      });
const path = window.location.pathname; // full path, e.g., "/home.html" or "/en/home.html"
const langLinks = document.querySelectorAll(".frame_burger .lang-container");

if (langLinks && langLinks.length >= 2) {
  // Pages in /en/ → EN
  if (path.startsWith("/en/")) {
    langLinks[1].classList.add("active"); // EN
    console.log("EN active");
  } else {
    // Any other page in root → UA
    langLinks[0].classList.add("active"); // UA
    console.log("UA active");
  }
}

    })
    .catch((err) => console.error("Burger menu load error:", err));
});

function closeBurger() {
  document.querySelector(".frame_burger").style.display = "none";
  document.body.classList.remove("menu-open");
}
function openBurger() {
  document.querySelector(".frame_burger").style.display = "flex";
  document.body.classList.add("menu-open");
}


