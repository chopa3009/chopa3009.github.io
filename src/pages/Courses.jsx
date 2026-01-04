import { useTranslation } from "react-i18next";
import styles from "../css/CoursesPageSection.module.css";

import startStudy from "../assets/start-study.svg";
import continuing from "../assets/continuing.svg";

const CoursesPageSection = ({ openModal }) => {
  const { t } = useTranslation();

  return (
    <>
<h1 style={{ display: "none" }}>Навчання у BOVÉ — це вхід у світ краси, де професія перетворюється на мистецтво.</h1>
    <div className={styles["courses-page-section-element-state"]}>
      <div className={styles["courses-page-areas-_of_study"]}>
        <div className={`${styles["courses-page-start_of_study"]} ${styles["courses-page"]}`}>
          <img className={styles["courses-page-icons-top"]} src={startStudy} alt="" />
          <div className={`${styles.text_courses} boveheading24regulardark`}>
            {t("courseBeginner")}
          </div>
          <p className={`${styles["text-courses-regular"]} bovebody20regularlight`}>
            {t("courseBeginnerSummary")}
          </p>
        </div>

        <div className={`${styles["courses-page-continuing_of_study"]} ${styles["courses-page"]}`}>
          <img className={styles["courses-page-icons-down"]} src={continuing} alt="" />
          <div className={`${styles.text_courses} boveheading24regulardark`}>
            {t("courseAdvanced")}
          </div>
          <p className={`${styles["text-courses-regular"]} bovebody20regularlight`}>
            {t("courseAdvancedSummary")}
          </p>
        </div>
                  <div className={styles.buttons} onClick={openModal}>
                    <div className="text bovebutton16regulardark">{t("courseSignUp")}</div>
                  </div>
      </div>

      <div className={styles["courses-page-title-body-text-footnote"]}>
        <p className={`${styles.bov} boveheading24regulardark`}>
          {t("coursesPageMainTitle")}
        </p>

        <div className={`${styles["text-courses-regular"]} bovebody20regularlight`}>
          <p >{t("coursesPageIntro")}</p>
        <p className={styles.sectionTitle}>{t("coursesLearnTitle")}</p>
          <p>{t("coursesColoringTitle")}</p>
          <ul>
            {t("coursesColoringList", { returnObjects: true }).map((i, k) => (
              <li key={k}>{i}</li>
            ))}
          </ul>

          <p>{t("coursesCareTitle")}</p>
          <ul>
            {t("coursesCareList", { returnObjects: true }).map((i, k) => (
              <li key={k}>{i}</li>
            ))}
          </ul>

          <p className={styles.sectionTitle}>{t("coursesAudienceTitle")}</p>
          <ul>
            {t("coursesAudienceList", { returnObjects: true }).map((i, k) => (
              <li key={k}>{i}</li>
            ))}
          </ul>

          <p className={styles.sectionTitle}>{t("coursesResultTitle")}</p>
          <ul>
            {t("coursesResultList", { returnObjects: true }).map((i, k) => (
              <li key={k}>{i}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default CoursesPageSection;
