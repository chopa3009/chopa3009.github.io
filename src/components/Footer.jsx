import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../css/Footer.css";

import instagram from "../assets/vector-9.svg";
import whatsapp from "../assets/whatsapp-outline-1.svg";
import telegram from "../assets/Telegram Outline white.svg";
import viber from "../assets/viber-outline.svg";
import footerLogo from "../assets/footer-logo.svg";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="footer" id="contacts-desktop">
        <div className="footer-containers">
          {/* Логотип, соцмережі */}
          <div className="footer-logo-social">
            <Link to="/">
              <img
                className="footer-logo"
                src={footerLogo}
                alt="Footer / Logo"
              />
            </Link>
            <div className="footer-social">
              <a
                href="https://instagram.com/_valentina_bodnaruk_"
                target="_blank"
                rel="noreferrer"
              >
                <div className="x-outline">
                  <img className="vector-9" src={instagram} alt="Instagram" />
                </div>
              </a>
              <a
                href="https://wa.me/380961744378"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="x-outline"
                  src={whatsapp}
                  alt="Whatsapp Outline"
                />
              </a>
              <a
                href="https://t.me/+380961744378"
                target="_blank"
                rel="noreferrer"
              >
                <div className="x-outline">
                  <img
                    className="subtract-1-footer subtract-2-footer"
                    src={telegram}
                    alt="Telegram Outline white"
                  />
                </div>
              </a>
              <a href="viber://chat?number=%2B380961744378">
                <img className="x-outline" src={viber} alt="Viber Outline" />
              </a>
            </div>
          </div>

          {/* Навігація */}
          <div className="footer-navigation mobtext16bove">
            <Link to="/#services-desktop">
              <div className="list-text-footer">{t("services")}</div>
            </Link>
            <Link to="/about">
              <div className="list-text-footer">{t("about")}</div>
            </Link>
            <Link to="/courses">
              <div className="list-text-footer">{t("courses")}</div>
            </Link>
            <Link to="/cosmetics">
              <div className="list-text-footer">{t("cosmetics")}</div>
            </Link>
            <Link to="/masters">
              <div className="list-text-footer">{t("masters")}</div>
            </Link>
            <Link to="/#portfolio-desktop">
              <div className="list-text-footer">{t("portfolio")}</div>
            </Link>

            <Link to="/#contacts-desktop">
              <div className="list-text-footer">{t("contacts")}</div>
            </Link>
          </div>

          {/* Контакти */}
          <div className="contact-info">
            <div className="footer-contact-1 mobtext16bove">
              <div className="footer-contact">
                <div className="disabled-text-footer">{t("schedule")}</div>
                <div className="contact-text-footer">{t("scheduleTime")}</div>
              </div>
              <div className="footer-contact">
                <div className="disabled-text-footer">{t("address")}</div>
                <div className="contact-text-footer">{t("addressText")}</div>
              </div>
              <div className="footer-contact mobtext16bove">
                <div className="disabled-text-footer">{t("phone")}</div>
                <a href="tel:+380961744378">
                  <p className="contact-text-footer">{t("phoneNumber")}</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Карта */}
        <iframe
          className="map-size"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2543.316832027831!2d30.61075777609465!3d50.397932691144334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4c554359e0bd7%3A0xb1882d2219818486!2z0JTQvdGW0L_RgNC-0LLRgdGM0LrQsCDQvdCw0LHQtdGA0LXQttC90LAsIDE40JAsINCa0LjRl9CyLCAwMjAwMA!5e0!3m2!1suk!2sua!4v1754730721921!5m2!1suk!2sua"
          width="384"
          height="250"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="map"
        ></iframe>
        {/* Footer bottom окремо */}
      </footer>
      <div className="footer-bottom">
        <p>
          &copy; {currentYear} {t("ownerText")}
        </p>
      </div>
    </>
  );
};

export default Footer;
