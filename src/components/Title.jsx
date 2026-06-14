import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import titleStyles from "../css/Title.module.css";
import sectionImage from "../assets/SectionImage.png";
import shopTitleImage from "../assets/ShopTitleImage.png";
import shopTitleImageMobile from "../assets/ShopTitleImageMobile.png";

// Titles in Ukrainian
const pageTitlesUA = {
  about: "BOVÉ– філософія <br/> твоєї краси.",
  courses: "Навчання у BOVÉ.",
  cosmetics: "Професійні засоби<br/> преміум класу.",
  masters: "Арт-директор<br/> Валентина Боднарук",
  haircut: "Ваш ідеальний <br/> стиль вже поруч.",
  coloring: "Ваш ідеальний <br/> стиль вже поруч.",
  restoration: "Вашідеальний  <br/> стиль вже поруч.",
  shop: "Ми привозимо професійну <br/> косметику під клієнта",
  index: "BOVÉ – ваш дім краси." // текст для Home (не використовується)
};

// Titles in English
const pageTitlesEN = {
  about: "BOVÉ – the philosophy <br/> of beauty.",
  courses: "Training at BOVÉ.",
  cosmetics: "Professional premium-<br/>class products.",
  masters: "Art Director<br/> Valentina Bodnaruk",
  haircut: "Your perfect <br/> style is near.",
  coloring: "Your perfect <br/> style is near.",
  restoration: "Your perfect <br/> style is near.",
  shop: "We source professional <br/> cosmetics for each client.",
  index: "BOVÉ – your home of beauty." // текст для Home (не використовується)
};

const titleVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.4, ease: "easeIn" } }
};

const TitleSection = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [pageClass, setPageClass] = useState("index");

  useEffect(() => {
    let currentPage = location.pathname.split("/").pop() || "index";
    if (location.pathname.startsWith("/shop/")) {
      currentPage = "shop";
    }
    if (currentPage === "") currentPage = "index";

    setPageClass(currentPage);

    const pageTitles = i18n.language === "en" ? pageTitlesEN : pageTitlesUA;
    const mobileShopTitle =
      i18n.language === "en"
        ? "We source professional <br/> cosmetics <br/> for each client"
        : "Ми привозимо  <br/> професійну  <br/> косметику під клієнта";

    // Оновлюємо title тільки якщо не Home
    if (currentPage !== "index") {
      if (currentPage === "shop" && typeof window !== "undefined" && window.innerWidth <= 767) {
        setTitle(mobileShopTitle);
      } else {
        setTitle(pageTitles[currentPage] || pageTitles.index);
      }
    }
    // Якщо currentPage === "index" → title залишається попереднім
  }, [location.pathname, i18n.language]);

  // Ключ для motion: Home завжди один, інші сторінки мають унікальний ключ
  const motionKey = pageClass === "index" ? "home" : location.pathname + i18n.language;
  const isShopPage = pageClass === "shop";
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 767;
  const currentImage = isShopPage
    ? (isMobile ? shopTitleImageMobile : shopTitleImage)
    : sectionImage;

  return (
    <div className={`${titleStyles["title-photo"]} ${titleStyles[pageClass]}`}>
      {isShopPage && (
        <img className={titleStyles.image} src={currentImage} alt="Section" />
      )}

      <div className={titleStyles.titleWrap}>
        <div className={titleStyles.title}>
          <AnimatePresence mode="wait">
            <motion.h1
              key={motionKey}
              variants={titleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`boveheading40regularlight ${titleStyles["title-text"]}`}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </AnimatePresence>
        </div>
      </div>

      {!isShopPage && (
        <img className={titleStyles.image} src={currentImage} alt="Section" />
      )}
    </div>
  );
};

export default TitleSection;
