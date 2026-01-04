import { useTranslation } from "react-i18next";
import styles from "../css/RestorationPageSection.module.css";

const RestorationPageSection = ({ openModal }) => {
  const { t } = useTranslation();

  const services = t("restorationServices", { returnObjects: true });
  const footnotes = t("restorationFootnotes", { returnObjects: true });

  return (
    <>
     <h1 style={{ display: "none" }}>Справжня краса починається з турботи.</h1>
    <div className={styles["restoration-page-section-element-state"]}>
      {/* Prices & booking */}
      <div className={styles["restoration-page-price-action-footnote"]}>
        <div className={styles["restoration-page-heading-price-action"]}>
          <div className={`${styles["restoration-1"]}`}>
            <div className={`${styles["text-header"]} boveheading24regulardark`}>
              {t("restorationTitle")}
            </div>
            <div className={`${styles["restoration-rectangle"]} restoration-1`}></div>

            <div className={`${styles["restoration-1"]} bovebody20regularlight`}>
              {services.map((service, i) => (
                <div key={i} className={styles["_restorations"]}>
                  <div className={styles["text-regular"]}>{service}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.buttons} onClick={openModal}>
            <div className="text_label bovebutton16regulardark">{t("bookNow")}</div>
          </div>
        </div>

        <div className={styles["footnote-price"]}>
          {footnotes.map((note, i) => (
            <p key={i} className={`${styles["text-footnote"]} bovebutton16regulardark`}>
              {note}
            </p>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className={styles["restoration-page-tit"]}>
        <div className={`${styles["restoration"]} ${styles["restoration-1"]}`}>
          <p className={`${styles["text-header-2"]} boveheading24regulardark`}>
            {t("restorationSubtitle")}
          </p>
          <p className={`${styles["text-regular-color"]} bovebody20regularlight`}>
            {t("restorationDescription")}
          </p>
        </div>
        <p className={`${styles["text-footnote"]} bovebutton16regulardark`}>
          {t("restorationContact")}
        </p>
      </div>
    </div>
    </>
  );
};

export default RestorationPageSection;
