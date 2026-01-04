import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Navigation.css";

const PageNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // Map route paths to translation keys
  const pageKeys = {
    "/": "home",
    "/about": "about",
    "/courses": "courses",
    "/cosmetics": "cosmetics",
    "/masters": "masters",
    "/haircut": "haircut",
    "/coloring": "coloring",
    "/restoration": "restoration",
    "/shop": "shop",
  };

  // Remove trailing slash if exists
  const path =
    location.pathname.endsWith("/") && location.pathname !== "/"
      ? location.pathname.slice(0, -1)
      : location.pathname;

  const currentKey = pageKeys[path] || "home";

  // Framer Motion variants
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <div className="page-navigation-wrap">
      {/* Wrapper забезпечує постійну висоту, щоб не ламати layout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname + currentKey} // ключ залежить від роуту
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="page-navigation"
        >
          {path !== "/" && (
            <>
              <Link to="/">
                <div className="text-disabled mobtext16bove">{t("home")}</div>
              </Link>
              <div className="text-disabled mobtext16bove">/</div>
            </>
          )}
          <div className="text-active bovecaption16mediumdark">{t(currentKey)}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageNavigation;
