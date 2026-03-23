import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../js/firebase";
import homeStyles from "../css/Home.module.css";
import rightArrow from "../assets/rightArrow.svg";

const CACHE_KEY = "home_portfolio_cache";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const PortfolioSlider = () => {
  const { i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const getCached = () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_TTL) {
          localStorage.removeItem(CACHE_KEY);
          return null;
        }
        return data;
      } catch {
        return null;
      }
    };

    const setCached = (data) => {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    };

    const load = async () => {
      const cached = getCached();
      if (cached) {
        setItems(cached);
        return;
      }

      try {
        const q = query(
          collection(db, "portfolio"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(data);
        setCached(data);
      } catch (err) {
        console.error("Error loading portfolio:", err);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (items.length > 0) setCurrent(0);
  }, [items.length]);

  const item = items[current];
  if (!item) return null;

  const isEn = i18n.language === "en";
  const title = isEn ? item.titleEn || item.title : item.title;
  const text = isEn ? item.descriptionEn || item.description : item.description;

  return (
    <section className={homeStyles.portfolioBlock} id="portfolio-desktop">
      <div className={homeStyles.portfolioCard}>
        <div className={homeStyles.portfolioImages}>
          <img
            className={homeStyles.portfolioImage}
            src={item.beforeBase64}
            alt="Before"
          />
          <img
            className={homeStyles.portfolioImage}
            src={item.afterBase64}
            alt="After"
          />
        </div>

        <div className={homeStyles.portfolioText}>
          <div className={homeStyles.portfolioTitle}>{title}</div>
          <p className={homeStyles.portfolioDescription}>{text}</p>
        </div>

        {items.length > 1 && (
          <div className={homeStyles.portfolioArrows}>
            <button
              className={`${homeStyles.portfolioArrow} ${homeStyles.portfolioArrowLeft}`}
              onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
              disabled={current === 0}
              aria-label="Previous portfolio"
            >
              <img src={rightArrow} alt="Prev" />
            </button>
            <button
              className={homeStyles.portfolioArrow}
              onClick={() =>
                setCurrent((prev) => Math.min(prev + 1, items.length - 1))
              }
              disabled={current === items.length - 1}
              aria-label="Next portfolio"
            >
              <img src={rightArrow} alt="Next" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSlider;
