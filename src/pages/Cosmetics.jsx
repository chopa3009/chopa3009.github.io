import { useTranslation } from "react-i18next";
import styles from "../css/CosmeticsPageSection.module.css";

import cosmeticLeft from "../assets/photo-cosmetic-left.png";
import cosmeticRight from "../assets/photo-cosmetic-right.png";

const CosmeticsPageSection = () => {
  const { t } = useTranslation();

  return (
    <>
     <h1 style={{ display: "none" }}>Ми використовуємо лише якісні професійні засоби.</h1>
    <div className={styles["cosmetics-page-section-element-state"]}>
      <div className={styles["cosmetics-page-photos"]}>
        <img
          className={`${styles["photo_cosmetic-top"]} ${styles.photo_cosmetic}`}
          src={cosmeticLeft}
          alt="Photo COSMETIC Top"
        />
        <img
          className={`${styles["photo_cosmetic-down"]} ${styles.photo_cosmetic}`}
          src={cosmeticRight}
          alt="Photo COSMETIC Down"
        />
      </div>

      <div className={styles["cosmetics-page-title-body-text-footnote"]}>
        <p className={`${styles["text-header-cosm"]} boveheading24regulardark`}>
          {t("cosmeticsTitle")}
        </p>

        <div className={`${styles.text_label} bovebody20regularlight`}>
          {t("cosmeticsText", { returnObjects: true }).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default CosmeticsPageSection;
