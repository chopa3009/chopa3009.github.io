import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import homeStyles from "../css/Home.module.css";
import PortfolioSlider from "../components/PortfolioSlider";
import Ticker from "../components/Ticker";

import bigLogo from "../assets/BOVE-big-LOGO.png";
import bigLogoMobile from "../assets/BOVE-big-LOGO-mobile.svg";
import boveLogo from "../assets/BOVElogo.svg";
import photoCut from "../assets/photo-cut.png";
import photoPaint from "../assets/photo-paint.png";
import photoCare from "../assets/photo-care.png";
import photoShop from "../assets/photo-shop.png";
import photoStudio from "../assets/photo-studio-1.png";
import startStudy from "../assets/start-study.svg";
import continuing from "../assets/continuing.svg";
import photoCosmeticLeft from "../assets/photo-cosmetic-left.png";
import photoCosmeticRight from "../assets/photo-cosmetic-right.png";
import photoMaster from "../assets/photo-master-1.png";

const Home = ({ openModal }) => {
  const { t } = useTranslation();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1439);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 1439);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const services = [
    { img: photoCut, titleKey: "haircut", link: "/haircut" },
    { img: photoPaint, titleKey: "coloring", link: "/coloring" },
    { img: photoCare, titleKey: "restoration", link: "/restoration" },
    { img: photoShop, titleKey: "shop", link: "/shop" },
  ];

  return (
    <>

    <h1 style={{ display: "none" }}>Концептуальний салон краси BOVÉ у Києві</h1>
      {/* Main photo */}
      <div className={homeStyles["bove-main-photo"]}>
        <div className={homeStyles["main-photo-container"]}></div>

        <div className={homeStyles["main_-logo-action"]}>
          <img
            className={homeStyles["bove-logo-mobile-hero"]}
            src={boveLogo}
            alt="BOVE logo"
          />
          <picture>
            <source srcSet={bigLogoMobile} media="(max-width: 767px)" />
            <img
              className={homeStyles["bove_-big_logo"]}
              src={bigLogo}
              alt="BOVE_Big_LOGO"
            />
          </picture>

          <div className={homeStyles["button-white"]} onClick={openModal}>
            <div className={`${homeStyles["text-button-white"]} mobtext16bove`}>
              {t("bookNow")}
            </div>
          </div>
        </div>
      </div>
     <Ticker />
      {/* Services */}
      <div
        className={`${homeStyles["services"]} scroll-services`}
        id="services-desktop"
      >
        {services.map((service) => {
          const titleKey =
            service.titleKey === "restoration" && isSmallScreen
              ? "restorationShort"
              : service.titleKey;

          return (
            <div
              key={service.titleKey}
              className={homeStyles["services-action"]}
            >
              <img
                className={homeStyles["photo-services"]}
                src={service.img}
                alt={t(titleKey)}
              />

              <div
                className={`${homeStyles["text-services"]} boveheading24regulardark`}
              >
                {t(titleKey)}
              </div>

              <Link to={service.link}>
                <div className={homeStyles["button-black"]}>
                  <div className="mobtext16bove">{t("choose")}</div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* About us */}
      <div className={homeStyles["about-us"]}>
        <img
          className={homeStyles["photo_studio"]}
          src={photoStudio}
          alt="Photo_STUDIO"
        />

        <div className={homeStyles["about-us-action"]}>
          <div className={homeStyles["about-us-text"]}>
            <div
              className={`${homeStyles["bove"]} boveheading24regulardark`}
            >
              {t("aboutUsTitle")}
            </div>

            <p className={`${homeStyles["text-aboutus"]} bovebody20regularlight`}>
              {t("aboutUsText")}
            </p>
          </div>

          <Link to="/about">
            <div className={homeStyles["button-white-aboutus"]}>
              <div className={`${homeStyles["text-button-white"]} mobtext16bove`}>
                {t("readMore")}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Courses */}
      <div className={homeStyles["courses"]}>
        <div className={homeStyles["s-action"]}>
          <div className={homeStyles["courses-text"]}>
            <p className={`${homeStyles["title"]} boveheading24regulardark`}>
              {t("coursesTitle")}
            </p>
            <p className={`${homeStyles["text-courses-summary"]} bovebody20regularlight`}>
              {t("coursesSummary")}
            </p>
          </div>

          <Link to="/courses">
            <div className={homeStyles["button-black"]}>
              <div className="mobtext16bove">{t("readMore1")}</div>
            </div>
          </Link>
        </div>

        <div className={homeStyles["areas-of-study"]}>
          <div className={homeStyles["start-of-study"]}>
            <div className={homeStyles["start"]}>
              <img
                className={homeStyles["vector-6"]}
                src={startStudy}
                alt="Vector"
              />
            </div>

            <div className={`${homeStyles["text_courses"]} boveheading24regulardark`}>
              {t("courseBeginner")}
            </div>

            <p className={`${homeStyles["text-courses-summary"]} bovebody20regularlight`}>
              {t("courseBeginnerSummary")}
            </p>
          </div>

          <div className={homeStyles["continuing-of-study"]}>
            <img
              className={homeStyles["continuing"]}
              src={continuing}
              alt="Continuing"
            />

            <div className={`${homeStyles["text_courses"]} boveheading24regulardark`}>
              {t("courseAdvanced")}
            </div>

            <p className={`${homeStyles["text-courses-summary"]} bovebody20regularlight`}>
              {t("courseAdvancedSummary")}
            </p>
          </div>
        </div>
      </div>

      {/* Cosmetics */}
      <div className={`${homeStyles["cosmetics"]} cosmetics-1`}>
        <div className={homeStyles["photos-cosmetic"]}>
          <img
            className={`${homeStyles["photo_cosmetic_-left"]} photo_cosmetic_`}
            src={photoCosmeticLeft}
            alt="Photo_COSMETIC_Left"
          />
          <img
            className={`${homeStyles["photo_cosmetic_-right"]} photo_cosmetic_`}
            src={photoCosmeticRight}
            alt="Photo_COSMETIC_Right"
          />
        </div>

        <div className={homeStyles["s-action"]}>
          <div className={`${homeStyles["cosmetics-text"]} cosmetics-1`}>
            <p className={`${homeStyles["title"]} boveheading24regulardark`}>
              {t("cosmeticsTitle")}
            </p>
            <p className={`${homeStyles["text-courses-summary"]} bovebody20regularlight`}>
              {t("cosmeticsSummary")}
            </p>
          </div>

          <Link to="/cosmetics">
            <div className={homeStyles["button-black"]}>
              <div className="mobtext16bove">{t("readMore2")}</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Masters */}
      <div className={homeStyles["masters"]}>
        <div className={homeStyles["masters-action"]}>
          <div className={homeStyles["masters-text"]}>
            <p className={`${homeStyles["title_master"]} boveheading24regulardark`}>
              {t("mastersTitle")}
            </p>
            <p className={`${homeStyles["text_master"]} bovebody20regularlight`}>
              {t("mastersTextHome")}
            </p>
          </div>

          <Link to="/masters">
            <div className={homeStyles["button-white-aboutus"]}>
              <div className={`${homeStyles["text-button-white"]} mobtext16bove`}>
                {t("readMore")}
              </div>
            </div>
          </Link>
        </div>

        <img
          className={homeStyles["photo_master"]}
          src={photoMaster}
          alt="Photo_MASTER"
        />
      </div>

      {/* Portfolio */}
      <PortfolioSlider />
    </>
  );
};

export default Home;
