import { useTranslation } from "react-i18next";
import styles from "../css/ColoringPageSection.module.css";

const ColoringPageSection = ({ openModal }) => {
  const { t } = useTranslation();

  // масив послуг (можна винести в i18n)
  const services = t("coloringServices", { returnObjects: true });

  const footnotes = t("coloringFootnotes", { returnObjects: true });

  return (
    <>
    <h1 style={{ display: "none" }}>Колір–це форма самовираження.</h1>
    <div className={styles["coloring-page-section-element-state"]}>
      {/* Prices & booking */}
      <div className={styles["coloring-page-price-action-footnote"]}>
        <div className={styles["coloring-page-heading-price-action"]}>
          <div className={`${styles["coloring-page"]} coloring`}>
            <div className={`${styles["text-header"]} boveheading24regulardark`}>
              {t("coloringTitle")}
            </div>
            <div className={`${styles["coloring-rectangle"]} coloring`}></div>

            <div className={`${styles["coloring-page"]} coloring bovebody20regularlight`}>
              {services.map((service, i) => (
                <div key={i} className={styles["coloring-prices"]}>
                  {typeof service === "string" ? (
                    <div className={styles["text-regular"]}>{service}</div>
                  ) : (
                    <p className={styles["text-regular"]}>
                      {service.map((line, k) => (
                        <span key={k}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  )}
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
      <div className={styles["coloring-page-title-body-text-footnote"]}>
        <div className={`${styles["coloring-page"]} coloring`}>
          <div className={`${styles["text-header-2"]} boveheading24regulardark`}>
            {t("coloringSubtitle")}
          </div>
          <p className={`${styles["text-regular-color"]} bovebody20regularlight`}>
            {t("coloringDescription")}
          </p>
        </div>
        <p className={`${styles["text-footnote"]} bovebutton16regulardark`}>
          {t("coloringContact")}
        </p>
      </div>
    </div>
    </>
  );
};

export default ColoringPageSection;
