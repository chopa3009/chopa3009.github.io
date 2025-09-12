const slidesUA = [
    {
      img: "/img/photo-after-1.png",
      title: "Кожне фарбування – індивідуальний проєкт.",
      text: "Складна техніка фарбування, яка забезпечує плавний перехід від коріння до кінчиків волосся. Розбили сивину для плавного відростання, натурального вигляду та глибини кольору. Робота зайняла 9 годин. Виконана за допомогою продуктів преміум класу."
    },
    {
      img: "/img/photo-after-2.png",
      title: "Кожне фарбування – індивідуальний проєкт.",
      text: "Майстерне поєднання складних технік фарбування, яке створює плавний перехід кольору, ніжний та багатогранний відтінок, що поєднує яскравість і природність, додаючи волоссю елегантності та виразності."
    },
    {
      img: "/img/photo-after-3.png",
      title: "Кожне фарбування – індивідуальний проєкт.",
      text: "Фарбування волосся в змішаних техніках для створення багатогранного, живого кольору та природних переходів. Така техніка дозволяє адаптувати колір до вашого стилю, підкреслюючи індивідуальність і додаючи об’єму та глибини вашому образу."
    },
    {
      img: "/img/photo-after-4.png",
      title: "Кожне фарбування – індивідуальний проєкт.",
      text: "Контур, рельєф, колір — усе продумано до деталей. Кожна робота — індивідуальне рішення, створене з технікою і смаком."
    }
  ];

  const slidesEN = [
    {
      img: "/img/photo-after-1.png",
      title: "Each coloring is a unique project.",
      text: "A complex coloring technique that creates a smooth transition from roots to ends. Blended the gray hair for natural regrowth, depth of color, and a soft look. The process took 9 hours using premium-class products."
    },
    {
      img: "/img/photo-after-2.png",
      title: "Each coloring is a unique project.",
      text: "A masterful combination of advanced coloring techniques that creates smooth transitions, delicate and multi-faceted shades, balancing brightness and naturalness while adding elegance and expressiveness to the hair."
    },
    {
      img: "/img/photo-after-3.png",
      title: "Each coloring is a unique project.",
      text: "Coloring in mixed techniques to create a rich, vibrant color with natural transitions. This approach adapts the shade to your style, emphasizing individuality while adding volume and depth to the look."
    },
    {
      img: "/img/photo-after-4.png",
      title: "Each coloring is a unique project.",
      text: "Contour, texture, and color — everything is thought out in detail. Each work is a tailor-made solution, crafted with skill and taste."
    }
  ];

  // Вибір мови зі сторінки
  const lang = document.documentElement.lang; // "uk" або "en"
  const slides = lang === "en" ? slidesEN : slidesUA;

  let current = 0;

  function showSlide(index) {
    const slide = slides[index];
    document.getElementById("photoAfter").src = slide.img;
    document.getElementById("portfolioTitle").textContent = slide.title;
    document.getElementById("portfolioText").textContent = slide.text;
  }

  function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  // показати перший слайд
  showSlide(current);