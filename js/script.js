        function closeModal() {
            document.querySelector('.modal-overlay').style.display = 'none';
        } ;
        function openModal() {
            document.querySelector('.modal-overlay').style.display = 'flex';
        };

function scrollToHash(hash) {
  if (!hash) return;
   if (window.innerWidth <= 1440) return;

  const target = document.querySelector(hash);
  if (target) {
    const headerOffset = -130; // висота фіксованого хедера
    const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    // Видаляємо хеш, щоб браузер не робив власний скрол
    history.replaceState(null, '', 'index.html');

    // Трохи чекаємо, щоб контент прогрузився
    setTimeout(() => {
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 100);
  }
}

// 1. При завантаженні сторінки
window.addEventListener('load', () => {
  scrollToHash(window.location.hash);
});

// 2. Якщо змінюється хеш на тій самій сторінці
window.addEventListener('hashchange', () => {
  scrollToHash(window.location.hash);
});

async function hidePreloaderAfterLoad() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  // Function to actually remove preloader
  const removePreloader = () => {
    if (preloader.parentNode) preloader.remove();
  };

  // Check if we are on shop.html
  const isShopPage = window.location.pathname.includes("shop.html");

  if (isShopPage && typeof loadProducts === "function") {
    // Wait for products to load first
    await loadProducts(); // assumes your loadProducts() is async and returns a promise
  }

  // Fade out
  preloader.classList.add("hide");

  // Remove after CSS transition
  preloader.addEventListener("transitionend", removePreloader);
  setTimeout(removePreloader, 500); // fallback in case transitionend doesn't fire
}

// Run on window load
window.addEventListener("load", hidePreloaderAfterLoad);




function closeOnOverlay(event) {
  if (event.target.classList.contains("modal-overlay")) {
    closeModal();
  }
}