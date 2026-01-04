import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import leftArrow from "../assets/left-arrow.svg";
import rightArrow from "../assets/right-arrow.svg";

import photoAfter1 from "../assets/photo-after-1.png";
import photoAfter2 from "../assets/photo-after-2.png";
import photoAfter3 from "../assets/photo-after-3.png";
import photoAfter4 from "../assets/photo-after-4.png";

import homeStyles from "../css/Home.module.css";

const slidesUA = [
  {
    img: photoAfter1,
    title: "Кожне фарбування – індивідуальний проєкт.",
    text:
      "Складна техніка фарбування, яка забезпечує плавний перехід від коріння до кінчиків волосся. Розбили сивину для плавного відростання, натурального вигляду та глибини кольору. Робота зайняла 9 годин. Виконана за допомогою продуктів преміум класу.",
  },
  {
    img: photoAfter2,
    title: "Кожне фарбування – індивідуальний проєкт.",
    text:
      "Майстерне поєднання складних технік фарбування, яке створює плавний перехід кольору, ніжний та багатогранний відтінок, що поєднує яскравість і природність, додаючи волоссю елегантності та виразності.",
  },
  {
    img: photoAfter3,
    title: "Кожне фарбування – індивідуальний проєкт.",
    text:
      "Фарбування волосся в змішаних техніках для створення багатогранного, живого кольору та природних переходів. Така техніка дозволяє адаптувати колір до вашого стилю, підкреслюючи індивідуальність і додаючи об’єму та глибини вашому образу.",
  },
  {
    img: photoAfter4,
    title: "Кожне фарбування – індивідуальний проєкт.",
    text:
      "Контур, рельєф, колір — усе продумано до деталей. Кожна робота — індивідуальне рішення, створене з технікою і смаком.",
  },
];

const slidesEN = [
  {
    img: photoAfter1,
    title: "Each coloring is a unique project.",
    text:
      "A complex coloring technique that creates a smooth transition from roots to ends. Blended the gray hair for natural regrowth, depth of color, and a soft look. The process took 9 hours using premium-class products.",
  },
  {
    img: photoAfter2,
    title: "Each coloring is a unique project.",
    text:
      "A masterful combination of advanced coloring techniques that creates smooth transitions, delicate and multi-faceted shades, balancing brightness and naturalness while adding elegance and expressiveness to the hair.",
  },
  {
    img: photoAfter3,
    title: "Each coloring is a unique project.",
    text:
      "Coloring in mixed techniques to create a rich, vibrant color with natural transitions. This approach adapts the shade to your style, emphasizing individuality while adding volume and depth to the look.",
  },
  {
    img: photoAfter4,
    title: "Each coloring is a unique project.",
    text:
      "Contour, texture, and color — everything is thought out in detail. Each work is a tailor-made solution, crafted with skill and taste.",
  },
];

const PortfolioSlider = () => {
  const { i18n } = useTranslation();
  const slides = i18n.language === "en" ? slidesEN : slidesUA;

  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  // autoplay every 5s
  useEffect(() => {
    const interval = setInterval(() => handleNext(), 5000);
    return () => clearInterval(interval);
  }, [current, slides.length]);

  // reset on language change
  useEffect(() => setCurrent(0), [i18n.language]);

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
      setFade(true);
    }, 300);
  };

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setFade(true);
    }, 300);
  };

  const slide = slides[current];

  return (
    <div
      className={homeStyles["block_-our-portfolio"]}
      id="portfolio-desktop"
    >
      <img
        className={`${homeStyles["photo_after_1"]} ${
          fade ? homeStyles["fade-in"] : homeStyles["fade-out"]
        }`}
        src={slide.img}
        alt="Photo_AFTER"
      />

      <div className={homeStyles["portfolio_1-action"]}>
        <div className={homeStyles["text-portfolio"]}>
          <div
            className={`${homeStyles["title"]} boveheading24regulardark`}
          >
            {slide.title}
          </div>

          <p
            className={`${homeStyles["text-courses-summary"]} bovebody20regularlight
             ${fade ? homeStyles["fade-in"] : homeStyles["fade-out"]}`}
          >
            {slide.text}
          </p>
        </div>

        <div className={homeStyles["navigation-arrows"]}>
          <div
            className={homeStyles["left-arrow"]}
            onClick={handlePrev}
          >
            <img
              className={homeStyles["vector-left"]}
              src={leftArrow}
              alt="Prev"
            />
          </div>

          <div
            className={homeStyles["right-arrow"]}
            onClick={handleNext}
          >
            <img
              className={homeStyles["vector-right"]}
              src={rightArrow}
              alt="Next"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSlider;
