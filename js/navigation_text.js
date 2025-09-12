document.addEventListener("DOMContentLoaded", function() {
  fetch("navigation.html")
    .then(r => r.text())
    .then(data => {
      document.getElementById("navigation-placeholder").innerHTML = data;

      const titleElement = document.querySelector(".text-active");

      // Тексти для української
      const pageTitlesUA = {
        "home.html": "Головна",
        "aboutus.html": "Про нас",
        "courses.html": "Курси",
        "cosmetics.html": "Косметика",
        "masters.html": "Майстри",
        "haircut.html": "Стрижка",
        "coloring.html": "Фарбування",
        "restoration.html": "Догляд та відновлення"
      };

      // Тексти для англійської
      const pageTitlesEN = {
        "home.html": "Home",
        "aboutus.html": "About Us",
        "courses.html": "Courses",
        "cosmetics.html": "Cosmetics",
        "masters.html": "Masters",
        "haircut.html": "Haircuts",
        "coloring.html": "Coloring",
        "restoration.html": "Care & Restoration"
      };

      // Поточний файл сторінки
      const pathParts = window.location.pathname.split("/");
      const fileName = pathParts.pop() || "home.html";

      // Визначаємо мову по html[lang]
      const htmlLang = document.documentElement.getAttribute("lang");
      const isEnglish = htmlLang === "en";

      // Вибір словника
      const pageTitles = isEnglish ? pageTitlesEN : pageTitlesUA;

      // Встановлюємо текст
      if (titleElement && pageTitles[fileName]) {
        titleElement.textContent = pageTitles[fileName];
      }
    })
    .catch(err => console.error("Navigation load error:", err));
});
