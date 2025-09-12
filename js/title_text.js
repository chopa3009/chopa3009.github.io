document.addEventListener("DOMContentLoaded", function() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Додаємо клас до body для стилізації по сторінці
  document.body.classList.add(currentPage.replace(".html", ""));

  fetch("title.html")
    .then(r => r.text())
    .then(data => {
      document.getElementById("title-placeholder").innerHTML = data;

      const titleElement = document.querySelector(".title-text");

      // Заголовки українською
      const pageTitlesUA = {
        "aboutus.html": "BOVÉ– філософія  <br/> твоєї краси.",
        "courses.html": "Навчання у BOVÉ.",
        "cosmetics.html": "Професійні засоби<br/> преміум класу.",
        "masters.html": "Арт-директор<br/> Валентина Боднарук",
        "haircut.html": "Ваш ідеальний <br/> стиль вже поруч.",
        "coloring.html": "Ваш ідеальний <br/> стиль вже поруч.",
        "restoration.html": "Ваш ідеальний <br/> стиль вже поруч."
      };

      // Заголовки англійською
      const pageTitlesEN = {
        "aboutus.html": "BOVÉ – the philosophy <br/> of beauty.",
        "courses.html": "Training at BOVÉ.",
        "cosmetics.html": "Professional premium-class products.",
        "masters.html": "Art Director<br/> Valentina Bodnaruk",
        "haircut.html": "Your perfect <br/> style is near.",
        "coloring.html": "Your perfect <br/> style is near.",
        "restoration.html": "Your perfect <br/> style is near."
      };

      // Визначаємо мову по html[lang]
      const htmlLang = document.documentElement.getAttribute("lang");
      const isEnglish = htmlLang === "en";

      const pageTitles = isEnglish ? pageTitlesEN : pageTitlesUA;

      if (titleElement && pageTitles[currentPage]) {
        titleElement.innerHTML = pageTitles[currentPage];
      }
    })
    .catch(err => console.error("Title load error:", err));
});
