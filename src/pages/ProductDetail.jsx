import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../js/firebase";
import { addToCart } from "../utils/cart";
import styles from "../css/ProductDetail.module.css";
import shopStyles from "../css/Shop.module.css";
import rightArrow from "../assets/rightArrow.svg";
import Toast from "../components/Toast";

const CACHE_KEY = "shop_products_cache";

const ProductDetail = ({ openModal }) => {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);
  const recTrackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const loadFromCache = () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;
        const { data } = JSON.parse(cached);
        return data?.products?.find((p) => p.id === id) || null;
      } catch {
        return null;
      }
    };

    const load = async () => {
      setLoading(true);
      const cachedProduct = loadFromCache();
      if (cachedProduct) {
        setProduct(cachedProduct);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "products", id));
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    const loadRecommended = async () => {
      if (!product?.brand) return;

      const cached = (() => {
        try {
          const cachedRaw = localStorage.getItem(CACHE_KEY);
          if (!cachedRaw) return null;
          const { data } = JSON.parse(cachedRaw);
          return data?.products || null;
        } catch {
          return null;
        }
      })();

      if (cached) {
        const sameBrand = cached.filter(
          (p) => p.brand === product.brand && p.id !== product.id
        );
        setRecommended(sameBrand);
        return;
      }

      try {
        const q = query(
          collection(db, "products"),
          where("brand", "==", product.brand)
        );
        const snap = await getDocs(q);
        const items = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p) => p.id !== product.id);
        setRecommended(items);
      } catch (err) {
        console.error("Error loading recommended products:", err);
      }
    };

    loadRecommended();
  }, [product]);

  useEffect(() => {
    const el = recTrackRef.current;
    if (!el) return;

    const checkScroll = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [recommended.length]);

  if (loading) return null;
  if (!product) {
    return (
      <section className={styles.wrapper}>
        <div className={styles.notFound}>Product not found</div>
      </section>
    );
  }

  const isEn = i18n.language === "en";
    const comment = isEn
    ? product.commentEn || product.comment
    : product.comment;
  const description = isEn
    ? product.descriptionEn || product.description
    : product.description;

  const tabContent = {
    description,
    delivery:
      "При наявності товару на складі, замовлення відправляється протягом 24 годин. Доставка здійснюється Новою поштою. Вартість доставки оплачується отримувачем згідно з тарифами перевізника.",
    payment:
      "• Готівкою при отриманні\n• Післяплата у відділенні пошти\n• Розрахунковий рахунок",
    returns:
      "Косметичні засоби не підлягають поверненню після відкриття упаковки відповідно до законодавства України.",
    warranty: "Гарантія від виробника.",
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.imageCol}>
          <img src={product.imageBase64} alt={product.title} />
        </div>

        <div className={styles.infoCol}>
          <div className={styles.brand}>{product.brand}</div>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.subtitle}>{comment}</p>

          <div
            className={`${styles.status} ${
              product.status === "В наявності" ? styles.inStock : styles.preOrder
            }`}
          >
            {product.status}
          </div>

          <div className={styles.actions}>
            {product.price ? (
              <div className={styles.priceValue}>{product.price} ₴</div>
            ) : (
              <button
                className={styles.priceBtn}
                onClick={() => openModal && openModal()}
              >
                Дізнатися ціну
              </button>
            )}
            <button
              className={styles.cartBtn}
              onClick={() => {
                addToCart(product);
                setToast("Товар додано в кошик");
                setTimeout(() => setToast(""), 2000);
              }}
            >
              До кошика
            </button>
          </div>

                    <div className={styles.tabs}>
            <button
              className={activeTab === "description" ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab("description")}
              type="button"
            >
              Опис
            </button>
            <button
              className={activeTab === "delivery" ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab("delivery")}
              type="button"
            >
              Доставка
            </button>
            <button
              className={activeTab === "payment" ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab("payment")}
              type="button"
            >
              Оплата
            </button>
            <button
              className={activeTab === "returns" ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab("returns")}
              type="button"
            >
              Повернення
            </button>
            <button
              className={activeTab === "warranty" ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab("warranty")}
              type="button"
            >
              Гарантія
            </button>
          </div>
          <p className={styles.longText}>{tabContent[activeTab]}</p>
        </div>
      </div>

      {recommended.length > 0 && (
        <div className={styles.recommended}>
          <div className={styles.recommendedHeader}>
            <h2 className={styles.recommendedTitle}>Рекомендовані товари</h2>
            <div className={shopStyles.arrows}>
              <button
                className={`${shopStyles.arrow} ${shopStyles.left}`}
                onClick={() => {
                  const el = recTrackRef.current;
                  if (el) el.scrollBy({ left: -320, behavior: "smooth" });
                }}
                aria-label="Previous"
                disabled={!canScrollLeft}
              >
                <img src={rightArrow} alt="Prev" />
              </button>
              <button
                className={shopStyles.arrow}
                onClick={() => {
                  const el = recTrackRef.current;
                  if (el) el.scrollBy({ left: 320, behavior: "smooth" });
                }}
                aria-label="Next"
                disabled={!canScrollRight}
              >
                <img src={rightArrow} alt="Next" />
              </button>
            </div>
          </div>

          <div className={styles.recommendedTrack} ref={recTrackRef}>
            {recommended.map((p) => (
              <div key={p.id} className={shopStyles.hitProduct}>
                <img src={p.imageBase64} alt={p.title} />
                <div className={shopStyles.titleBlock}>
                  <h3 className={shopStyles.brandName}>{p.brand}</h3>
                  <h3>{p.title}</h3>
                </div>
                <p>{p.comment || ""}</p>
                <p
                  className={`${shopStyles.status} ${
                    p.status === "В наявності"
                      ? shopStyles.inStock
                      : shopStyles.preOrder
                  }`}
                >
                  {p.status}
                </p>
                <div className={shopStyles.priceRow}>
                  <span
                    className={`${shopStyles.price} ${
                      !p.price ? shopStyles.contractPrice : ""
                    }`}
                  >
                    {p.price ? `${p.price} ₴` : "Ціна договірна"}
                  </span>
                  <button
                    className={shopStyles.cartBtn}
                    onClick={() => {
                      addToCart(p);
                      setToast("Товар додано в кошик");
                      setTimeout(() => setToast(""), 2000);
                    }}
                    aria-label="Add to cart"
                  >
                    <svg
                      width="20"
                      height="18"
                      viewBox="0 0 20 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.60938 5H4.38672C3.0871 5 2.43782 5 1.97559 5.26514C1.56995 5.49781 1.25815 5.86535 1.09533 6.30371C0.9099 6.80294 1.01663 7.44333 1.23002 8.72367L1.23047 8.72607L2.1638 14.3261C2.32213 15.276 2.40182 15.7512 2.63884 16.1077C2.84778 16.4219 3.14108 16.6703 3.48535 16.8247C3.87591 16.9999 4.35724 17 5.32031 17H13.8987C14.8618 17 15.3428 16.9999 15.7333 16.8247C16.0776 16.6703 16.3711 16.4219 16.5801 16.1077C16.8171 15.7512 16.8964 15.276 17.0547 14.3261L17.988 8.72607L17.9889 8.72217C18.2022 7.44283 18.3088 6.80274 18.1235 6.30371C17.9607 5.86535 17.6496 5.49781 17.244 5.26514C16.7817 5 16.1314 5 14.8318 5H13.6094M5.60938 5H13.6094M5.60938 5C5.60938 2.79086 7.40024 1 9.60938 1C11.8185 1 13.6094 2.79086 13.6094 5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Toast text={toast} />
    </section>
  );
};

export default ProductDetail;


