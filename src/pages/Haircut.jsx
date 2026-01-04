import { useTranslation } from "react-i18next";
import styles from "../css/HaircutPageSection.module.css";
import { useState} from "react";

const HaircutPageSection = ({ openModal }) => {
  const { t } = useTranslation();

  return (
    <>
     <h1 style={{ display: "none" }}>Твоя стрижка–як продовження характеру.</h1>
    <div className={styles["haircut-page-section-element-state"]}>
      {/* Prices & booking */}
      <div className={styles["re-haircut-page-price-action-footnote"]}>
        <div className={styles["haircut-page-heading-price-action"]}>
          <div className={styles["haircut-page"]}>
            <div className={`${styles["text-headers"]} boveheading24regulardark`}>
              {t("haircutsTitle")}
            </div>
            <div className={styles["haircut-page-rectangle"]}></div>

            <div className={`${styles["haircut-page"]} bovebody20regularlight`}>
              {t("haircutsList", { returnObjects: true }).map((service, i) => (
                <div key={i} className={styles["haircut-prices"]}>
                  <div className={styles["text-haircut-type"]}>{service}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.buttons} onClick={openModal}>
            <div className="text bovebutton16regulardark">{t("bookNow")}</div>
          </div>
        </div>

        <div className={styles["footnote-price"]}>
          {t("haircutsFootnote", { returnObjects: true }).map((p, i) => (
            <p key={i} className={`${styles["text-footnote"]} bovebutton16regulardark`}>
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className={styles["haircut-page-title-body-text-footnote"]}>
        <div className={styles["haircut-page"]}>
          <div className={`${styles["text-headers-2"]} boveheading24regulardark`}>
            {t("haircutsSubtitle")}
          </div>

          <div className={`${styles["text-regular"]} bovebody20regularlight`}>
            {t("haircutsDescription", { returnObjects: true }).map((p, i) =>
              typeof p === "string" ? (
                <p key={i}>{p}</p>
              ) : (
                <ul key={i}>
                  {p.map((li, k) => (
                    <li key={k}>{li}</li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>

        <p className={`${styles["text-footnote"]} bovebutton16regulardark`}>
          {t("haircutsContact")}
        </p>
      </div>
    </div>
    </>
  );
};

export default HaircutPageSection;
