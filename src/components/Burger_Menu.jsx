import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

import "../css/Burger_Menu.css";

import closeIcon from "../assets/cross.svg";
import instagram from "../assets/Instagram Outline.svg";
import whatsapp from "../assets/whatsapp-outline.svg";
import telegram from "../assets/Telegram Outline.svg";
import viber from "../assets/Viber Outline.svg";

const BurgerMenu = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const burgerRef = useRef(null);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  /* ---------- language ---------- */
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  /* ---------- close on outside click ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (burgerRef.current && !burgerRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  /* ---------- close on ESC ---------- */
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  /* ---------- disable scroll ---------- */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="frame_burger">
      <div className="burger-container" ref={burgerRef}>

        {/* HEADER */}
        <div className="burger-header">
          <div className="lanuage-buttons">
            {["ua", "en"].map((lang) => (
              <div
                key={lang}
                className={`lang-container ${i18n.language === lang ? 'active' : ''}`}
                onClick={() => changeLanguage(lang)}
              >
                <div className="lang-text">{lang.toUpperCase()}</div>
              </div>
            ))}
          </div>

          <div className="close-button-burger" onClick={onClose}>
            <img className="close-icon" src={closeIcon} alt="close" />
          </div>
        </div>

        {/* MENU */}
        <div className="frame-header-button">
          <Link to="/" onClick={onClose}>
            <div className="list-text">{t("home")}</div>
          </Link>

          <div
            className="list-text"
            onClick={() => setIsServicesOpen((p) => !p)}
          >
            {t("services")} ▾
          </div>

          {isServicesOpen && (
            <div id="services-submenu" className="submenu">
              {["haircut", "coloring", "restoration"].map((item) => (
                <Link
                  key={item}
                  to={`/${item}`}
                  onClick={onClose}
                >
                  <div className="list-text">{t(item)}</div>
                </Link>
              ))}
            </div>
          )}

          <Link to="/shop" onClick={onClose}>
            <div className="list-text">{t("shop")}</div>
          </Link>

          {["about", "courses", "cosmetics", "masters"].map((item) => (
            <Link key={item} to={`/${item}`} onClick={onClose}>
              <div className="list-text">{t(item)}</div>
            </Link>
          ))}

<Link to="/?scrollTo=portfolio-desktop" onClick={onClose}>
  <div className="list-text">{t("portfolio")}</div>
</Link>

<Link to="#contacts-desktop" onClick={onClose}>
  <div className="list-text">{t("contacts")}</div>
</Link>
        </div>

        {/* CONTACTS */}
        <div className="burger-contacts">
          <a href="tel:+380961744378">
            <p className="burger-phone">+380 96 174 43 78</p>
          </a>

          <div className="social-icons">
            <a href="https://instagram.com/_valentina_bodnaruk_">
              <img className="social-img" src={instagram} alt="Instagram" />
            </a>
            <a href="https://wa.me/380961744378">
              <img className="social-img" src={whatsapp} alt="WhatsApp" />
            </a>
            <a href="https://t.me/+380961744378">
              <img className="social-img" src={telegram} alt="Telegram" />
            </a>
            <a href="viber://chat?number=%2B380961744378">
              <img className="social-img" src={viber} alt="Viber" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BurgerMenu;
