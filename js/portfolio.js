document.addEventListener("DOMContentLoaded", function() {
(function () {
  const BP = 1440; // breakpoint
  const portfolio = document.getElementById('portfolio-desktop');
  if (!portfolio) return;

  const action = portfolio.querySelector('.portfolio_1-action');
  const arrows = portfolio.querySelector('.navigation-arrows');
  const photo = portfolio.querySelector('.photo_after_1');
  if (!action || !arrows || !photo) return;

  function adapt() {
    if (window.innerWidth <= BP) {
      // move arrows after photo (if not already moved)
      if (arrows.parentElement !== portfolio) {
        portfolio.insertBefore(arrows, photo.nextSibling);
      }
      // mobile layout class for styling tweaks
      portfolio.classList.add('portfolio-mobile');
    } else {
      // move arrows back into action (if not already there)
      if (arrows.parentElement !== action) {
        action.appendChild(arrows);
      }
      portfolio.classList.remove('portfolio-mobile');
    }
  }

  window.addEventListener('resize', adapt);
  document.addEventListener('DOMContentLoaded', adapt);
  adapt();
})();
});
