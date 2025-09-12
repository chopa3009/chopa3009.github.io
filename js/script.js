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

window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("hide");
      setTimeout(() => {
        preloader.remove(); // повністю видаляємо з DOM після анімації
      }, 500); // час має збігатися з transition у CSS
    }
  });


