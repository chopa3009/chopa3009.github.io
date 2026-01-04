import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import titleStyles from "../css/Title.module.css";
import sectionImage from "../assets/SectionImage.png";

// Titles in Ukrainian
const pageTitlesUA = {
  about: "BOVÉ– філософія <br/> твоєї краси.",
  courses: "Навчання у BOVÉ.",
  cosmetics: "Професійні засоби<br/> преміум класу.",
  masters: "Арт-директор<br/> Валентина Боднарук",
  haircut: "Ваш ідеальний <br/> стиль вже поруч.",
  coloring: "Ваш ідеальний <br/> стиль вже поруч.",
  restoration: "Ваш ідеальний <br/> стиль вже поруч.",
  shop: "Ваш ідеальний <br/> стиль вже поруч.",
  index: "BOVÉ – ваш дім краси." // текст для Home (не використовується)
};

// Titles in English
const pageTitlesEN = {
  about: "BOVÉ – the philosophy <br/> of beauty.",
  courses: "Training at BOVÉ.",
  cosmetics: "Professional premium-class products.",
  masters: "Art Director<br/> Valentina Bodnaruk",
  haircut: "Your perfect <br/> style is near.",
  coloring: "Your perfect <br/> style is near.",
  restoration: "Your perfect <br/> style is near.",
  shop: "Your perfect <br/> style is near.",
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
    if (currentPage === "") currentPage = "index";

    setPageClass(currentPage);

    const pageTitles = i18n.language === "en" ? pageTitlesEN : pageTitlesUA;

    // Оновлюємо title тільки якщо не Home
    if (currentPage !== "index") {
      setTitle(pageTitles[currentPage] || pageTitles.index);
    }
    // Якщо currentPage === "index" → title залишається попереднім
  }, [location.pathname, i18n.language]);

  // Ключ для motion: Home завжди один, інші сторінки мають унікальний ключ
  const motionKey = pageClass === "index" ? "home" : location.pathname + i18n.language;

  return (
    <div className={`${titleStyles["title-photo"]} ${titleStyles[pageClass]}`}>
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

      <img className={titleStyles.image} src={sectionImage} alt="Section" />
    </div>
  );
};

export default TitleSection;
