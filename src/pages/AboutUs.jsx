import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../css/AboutUs.module.css"; // CSS Module
import aboutPhoto from "../assets/img-0976.png"; // image path

const AboutUsSection = () => {
  const { t } = useTranslation();

  // Replace newline characters with <br /> elements
  const formattedText = t("aboutUsFullText")
    .split("\n")
    .map((line, idx) => (
      <React.Fragment key={idx}>
        {line}
        <br />
      </React.Fragment>
    ));

  return (
    <>
    <h1 style={{ display: "none" }}>BOVÉ–індивідуальний простір для краси.</h1>
    <div className={styles["about_us-page-section-element-state"]}>
      <img
        className={styles["about_us-page-photo"]}
        src={aboutPhoto}
        alt={t("aboutUsTitle")}
      />
      <div className={styles["about_us-page-title-body-text"]}>
        <div className={`${styles["bov"]} boveheading24regulardark ${styles["title-text"]}`}>
          {t("aboutUsTitle")}
        </div>
        <p className={`${styles["text-body"]} bovebody20regularlight ${styles["body-text"]}`}>
          {formattedText}
        </p>
      </div>
    </div>
    </>
  );
};

export default AboutUsSection;
