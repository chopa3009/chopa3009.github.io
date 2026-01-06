import { Link } from "react-router-dom";
import "../css/Header.css";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

import BurgerMenu from "./Burger_Menu";

import logo from '../assets/Logo.svg';
import arrow from '../assets/Arrow.svg';
import instagram from '../assets/vector-7.svg';
import viber from '../assets/vector-8.svg';
import telegram from '../assets/Telegram Outline.svg';
import whatsapp from '../assets/whatsapp-outline.svg';
import burger from '../assets/burger.svg';
import phone from '../assets/communication-phone.svg';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false); // ✅ new state
  const dropdownRef = useRef(null);

  // Match exactly your CSS breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1440px)");

    const handleChange = (e) => setIsDesktop(e.matches);

    setIsDesktop(mq.matches);
    mq.addEventListener("change", handleChange);

    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* RENDER ONLY DESKTOP OR MOBILE */}
      {isDesktop ? (
        <header className="header">
          <div className="header-logo">
            <Link to="/"><img src={logo} alt="Logo" /></Link>
          </div>

          <nav className="navbar mobtext16bove">
            <div className={`dropdown ${isDropdownOpen ? 'active' : ''}`} ref={dropdownRef}>
              <div className="text-navbar dropdown-toggle" onClick={toggleDropdown}>
                {t('services')}
                <img src={arrow} alt="arrow" className="dropdown-arrow" />
              </div>
              <div className="dropdown-content">
                {['haircut','coloring','restoration','shop'].map((item) => (
                  <Link key={item} to={`/${item}`} onClick={() => setIsDropdownOpen(false)}>
                    {t(item)}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/about"><div className="text-navbar">{t('about')}</div></Link>
            <Link to="/courses"><div className="text-navbar">{t('courses')}</div></Link>
            <Link to="/cosmetics"><div className="text-navbar">{t('cosmetics')}</div></Link>
            <Link to="/masters"><div className="text-navbar">{t('masters')}</div></Link>
            <Link to="/#portfolio-desktop"><div className="text-navbar">{t('portfolio')}</div></Link>
            <Link to="#contacts-desktop"><div className="text-navbar">{t('contacts')}</div></Link>
          </nav>

          <div className="header-actions">
            <div className="header-action-language header-action">
              {['en','ua'].map(lang => (
                <div 
                  key={lang}
                  className={`lang-link ${lang} mobtext16bove ${i18n.language === lang ? 'active' : ''}`} 
                  onClick={() => changeLanguage(lang)}
                >
                  {lang.toUpperCase()}
                </div>
              ))}
            </div>

            <div className="header-action-icon header-action">
              <a href="https://instagram.com/_valentina_bodnaruk_" target="_blank" rel="noreferrer">
                <img src={instagram} alt="Instagram" />
              </a>
              <a href="https://wa.me/380961744378">
                <img src={whatsapp} alt="WhatsApp" />
              </a>
              <a href="https://t.me/+380961744378">
                <img src={telegram} alt="Telegram" />
              </a>
              <a href="viber://chat?number=%2B380961744378">
                <img src={viber} alt="Viber" />
              </a>
            </div>
          </div>
        </header>
      ) : (
        <header className="mobile-header">
          <div className="burger-icon" onClick={() => setIsBurgerOpen(true)}>
            <img src={burger} alt="Burger" />
          </div>

          <Link to="/">
            <img className="bove-logo" src={logo} alt="Logo" />
          </Link>

          <a href="tel:+380961744378">
            <div className="communication-phone-1">
              <img className="phone-icon" src={phone} alt="Phone" />
            </div>
          </a>
        </header>
      )}

      <BurgerMenu
        isOpen={isBurgerOpen}
        onClose={() => setIsBurgerOpen(false)}
      />
    </>
  );
};

export default Header;
