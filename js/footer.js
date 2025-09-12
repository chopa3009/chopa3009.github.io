document.addEventListener("DOMContentLoaded", function () {
  // Load burger menu
  fetch("footer.html")
    .then((r) => r.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
      console.log("222");

      const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Посилання на "Послуги" та "Наші роботи"
  const serviceLink = document.querySelector('.footer a[href="#services-desktop"]');
  const portfolioLink = document.querySelector('.footer a[href="#portfolio-desktop"]');

  if (currentPage !== "index.html") {
    if (serviceLink) serviceLink.setAttribute("href", "index.html#services-desktop");
    if (portfolioLink) portfolioLink.setAttribute("href", "index.html#portfolio-desktop");
  } else {
    if (serviceLink) serviceLink.setAttribute("href", "#services-desktop");
    if (portfolioLink) portfolioLink.setAttribute("href", "#portfolio-desktop");
  }

  const yearSpan = document.getElementById("currentYear");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
    })
    .catch((err) => console.error("Burger menu load error:", err));
});



