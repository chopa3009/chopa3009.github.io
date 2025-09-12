function updateServiceText() {
  const textEl = document.getElementById("service-text");
  if (!textEl) return;

  const path = window.location.pathname;
  const isEnglish = path.startsWith("/en/");

  if (isEnglish) {
    // англійська версія
    if (window.innerWidth < 1440) {
      textEl.textContent = "Restoration";
    } else {
      textEl.textContent = "Care and restoration";
    }
  } else {
    // українська версія
    if (window.innerWidth < 1440) {
      textEl.textContent = "Відновлення";
    } else {
      textEl.textContent = "Догляд та відновлення";
    }
  }
}

// запуск при завантаженні
updateServiceText();

// запуск при зміні розміру
window.addEventListener("resize", updateServiceText);
