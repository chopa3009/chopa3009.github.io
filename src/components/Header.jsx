import { Link, useLocation } from "react-router-dom";
import "../css/Header.css";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

import BurgerMenu from "./Burger_Menu";
import CartBadge from "./CartBadge";

import logo from '../assets/Logo.svg';
import logoShop from '../assets/white_logo.svg';
import arrow from '../assets/Arrow.svg';
import phone1 from '../assets/Phone1.svg';
import burger from '../assets/burger.svg';

const Header = ({ onCartOpen }) => {
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
            <Link to="/">
              <img src={logo} alt="Logo" className="logo-default" />
            </Link>
          </div>

          <nav className="navbar mobtext16bove">
            <div className={`dropdown ${isDropdownOpen ? 'active' : ''}`} ref={dropdownRef}>
              <div className="text-navbar dropdown-toggle" onClick={toggleDropdown}>
                {t('services')}
                <img src={arrow} alt="arrow" className="dropdown-arrow" />
              </div>
              <div className="dropdown-content">
                {['haircut', 'coloring', 'restoration'].map((item) => (
                  <Link key={item} to={`/${item}`} onClick={() => setIsDropdownOpen(false)}>
                    {t(item)}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/shop"><div className="text-navbar">{t('shop')}</div></Link>
            <Link to="/about"><div className="text-navbar">{t('about')}</div></Link>
            <Link to="/courses"><div className="text-navbar">{t('courses')}</div></Link>
            <Link to="/cosmetics"><div className="text-navbar">{t('cosmetics')}</div></Link>
            <Link to="/masters"><div className="text-navbar">{t('masters')}</div></Link>
            <Link to="/?scrollTo=portfolio-desktop"><div className="text-navbar">{t('portfolio')}</div></Link>
            <Link to="#contacts-desktop"><div className="text-navbar">{t('contacts')}</div></Link>
          </nav>

          <div className="header-actions">
            <div className="header-action-language header-action">
              {['en', 'ua'].map(lang => (
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
              <a href="tel:+380961744378">
                <div className="phone1">
                  <img className="phone-icon" src={phone1} alt="Phone" />
                </div>
              </a>
              <CartBadge onOpen={onCartOpen} />
            </div>

          </div>
        </header>
      ) : (
        <header className="mobile-header">
          <div className="burger-icon" onClick={() => setIsBurgerOpen(true)}>
            <img src={burger} alt="Burger" />
          </div>

          <Link to="/" className="mobile-logo-link">
            <img className="bove-logo" src={logo} alt="Logo" />
          </Link>

          <div className="mobile-header-actions">
            <a href="tel:+380961744378" className="mobile-phone-link" aria-label="Call phone number">
              <img className="phone-icon" src={phone1} alt="Phone" />
            </a>
            <CartBadge onOpen={onCartOpen} />
          </div>
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
