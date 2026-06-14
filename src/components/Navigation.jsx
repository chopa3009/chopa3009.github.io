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

  const isProductPage = path.startsWith("/shop/");
  const currentKey = pageKeys[path] || (isProductPage ? "shop" : "home");
  const productTitle = location.state?.productTitle || "Товар";
  const brandFromState = location.state?.brandName;
  const brandFromQuery = new URLSearchParams(location.search).get("brand");
  const brandName = brandFromState || brandFromQuery;

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
          className={`page-navigation ${isProductPage ? "product-page-navigation" : ""}`}
        >
          {path !== "/" && (
            <>
              <Link to="/">
                <div className="text-disabled mobtext16bove">{t("home")}</div>
              </Link>
              <div className="text-disabled mobtext16bove">/</div>
            </>
          )}

          {isProductPage ? (
            <>
              <Link to="/shop">
                <div className="text-disabled mobtext16bove">{t("shop")}</div>
              </Link>
              <div className="text-disabled mobtext16bove">/</div>
              {brandName ? (
                <>
                  <Link to={`/shop?brand=${encodeURIComponent(brandName)}`}>
                    <div className="text-disabled mobtext16bove">{brandName}</div>
                  </Link>
                  <div className="text-disabled mobtext16bove">/</div>
                </>
              ) : null}
              <div className="text-active bovecaption16mediumdark">
                {productTitle}
              </div>
            </>
          ) : (
            <div className="text-active bovecaption16mediumdark">
              {t(currentKey)}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageNavigation;
