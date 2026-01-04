import { useTranslation } from "react-i18next";
import styles from "../css/MastersPageSection.module.css";

import masterPhoto from "../assets/masterspage---photo.png";

const MastersPageSection = () => {
  const { t } = useTranslation();

  return (
    <>
     <h1 style={{ display: "none" }}>Майстер та сертифікований фахівець з догляду за волоссям і шкірою голови</h1>
    <div className={styles["masters-page-section-element-state"]}>
      <img
        className={styles["masters-page-photo"]}
        src={masterPhoto}
        alt="MastersPage / Photo"
      />

      <div className={styles["masters-page-title-body-text-footnote"]}>
        <div className={styles["masters-page-title-body-text"]}>
          <p className={`${styles["text-master-header"]} boveheading24regulardark`}>
            {t("mastersTitle")}
          </p>

          <div className={`${styles["text-master-regular"]} bovebody20regularlight`}>
            {t("mastersText", { returnObjects: true }).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default MastersPageSection;
