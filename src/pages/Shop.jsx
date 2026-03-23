import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { db } from "../js/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import styles from "../css/Shop.module.css";
import CartIcon from "../assets/cart.svg";
import ArrowRightIcon from "../assets/rightArrow.svg";
import { addToCart } from "../utils/cart";
import Toast from "../components/Toast";

const CACHE_KEY = "shop_products_cache";
const CACHE_TTL = 60 * 60 * 1000; // 1 година

const RestorationPageSection = ({ openModal }) => {
  const { t, i18n } = useTranslation();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
const [selectedBrands, setSelectedBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const productsRef = useRef(null);
  const hitRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [toast, setToast] = useState("");

  const handleAddToCart = (product) => {
  addToCart(product);
  setToast("Товар додано в кошик");

  setTimeout(() => setToast(""), 2000);
};

  useEffect(() => {
    document.body.classList.add("shop-page");
    return () => document.body.classList.remove("shop-page");
  }, []);

  // ===== Cache helpers =====
  const getCachedProducts = () => {
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

  const handleBrandToggle = (brand) => {
  setSelectedBrands((prev) =>
    prev.includes(brand)
      ? prev.filter((b) => b !== brand)
      : [...prev, brand]
  );
};

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const brandParam = params.get("brand");
    if (brandParam) {
      setSelectedBrands([brandParam]);
    } else {
      setSelectedBrands([]);
    }
  }, [location.search]);

  const setCachedProducts = (data) => {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  };

  // ===== Load products =====
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);

      const cached = getCachedProducts();
      if (cached) {
        setProducts(cached.products);
        setBrands(cached.brands);
        setIsLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "products"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const brandSet = new Set(allProducts.map((p) => p.brand));
        const brandsData = Array.from(brandSet);

        setProducts(allProducts);
        setBrands(brandsData);

        setCachedProducts({ products: allProducts, brands: brandsData });
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ===== Brand filter =====
  const handleBrandClick = (brand) => {
    setActiveBrand(brand);
    if (productsRef.current && window.innerWidth >= 768) {
      productsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

const filteredProducts =
  selectedBrands.length === 0
    ? products
    : products.filter((p) =>
        selectedBrands.includes(p.brand)
      );

  // ===== Hit Products Scroll =====
  const hitProducts = products.filter((p) => p.isHit === true);
  const CARD_WIDTH = 280 + 24; // ширина + gap

  const checkScroll = () => {
    if (!hitRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = hitRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    hitRef.current?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      hitRef.current?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [hitProducts]);

  const scrollLeft = () => {
    if (!hitRef.current) return;
    hitRef.current.scrollBy({ left: -CARD_WIDTH, behavior: "smooth" });
  };
  const scrollRight = () => {
    if (!hitRef.current) return;
    hitRef.current.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
  };

  const lang = i18n.language === "en" ? "en" : "ua";

  if (isLoading) return null;

  return (
    <>
      {/* ===== Hit Products ===== */}
      {hitProducts.length > 0 && (
        <div className={styles.hitWrapper}>
          <div className={styles.hitHeader}>
            <h2 className={styles.h2Header}>{t("hitSalesTitle")}</h2>
            <div className={styles.arrows}>
              <button
                onClick={scrollLeft}
                className={`${styles.arrow} ${styles.left}`}
                disabled={!canScrollLeft}
              >
                <img src={ArrowRightIcon} alt="Left" width={36} height={36} />
              </button>

              <button
                onClick={scrollRight}
                className={styles.arrow}
                disabled={!canScrollRight}
              >
                <img src={ArrowRightIcon} alt="Right" width={36} height={36} />
              </button>
            </div>
          </div>

          <div className={styles.hitViewport}>
            <section ref={hitRef} className={styles.hitSection}>
                {hitProducts.map((p) => {
                  const description =
                    lang === "en" ? p.commentEn || p.comment : p.comment;

                  return (
                  <div key={p.id} className={styles.hitProduct}>
                    <Link
                      to={`/shop/${p.id}?brand=${encodeURIComponent(p.brand || "")}`}
                      state={{ productTitle: p.title, brandName: p.brand }}
                      className={styles.productLink}
                    >
                      <img src={p.imageBase64} alt={p.title} />
                    </Link>
                    <div className={styles.titleBlock}>
                      <h3 className={styles.brandName}>{p.brand}</h3>
                      <h3>
                        <Link
                          to={`/shop/${p.id}?brand=${encodeURIComponent(p.brand || "")}`}
                          state={{ productTitle: p.title, brandName: p.brand }}
                          className={styles.productLink}
                        >
                          {p.title}
                        </Link>
                      </h3>
                    </div>
                    <p>{description}</p>

                    {/* статус */}
                    <p
                      className={`${styles.status} ${
                        p.status === "В наявності"
                          ? styles.inStock
                          : styles.preOrder
                      }`}
                    >
                      {p.status}
                    </p>

                    {/* ціна + корзина */}
                    <div className={styles.priceRow}>
                      <span
                        className={`${styles.price} ${
                          !p.price ? styles.contractPrice : ""
                        }`}
                      >
                        {p.price ? `${p.price} ₴` : t("priceTitle")}
                      </span>

                      <button
                        className={styles.cartBtn}
                         onClick={() => handleAddToCart(p)}
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
                );
              })}
            </section>
          </div>
        </div>
      )}

      {/* ===== Brands & Products ===== */}
      <h2 className={styles.h2HeaderCatalog}>{t("catalogTitle")}</h2>
      <div className={styles["restoration-page-section-element-state"]}>
        <div className={styles["restoration-page-price-action-footnote"]}>
          <div className={styles["restoration-page-heading-price-action"]}>
            <div className={styles.restoration1}>
              <div
                className={`${styles["text-header"]} boveheading24regulardark`}
              >
                {t("brandsTitle")}
              </div>
              <div
                className={`${styles["restoration-rectangle"]} ${styles.restoration1}`}
              />
              <div className={`${styles.restoration1} bovebody20regularlight`}>
                <div className={styles.restoration1}>
{brands.map((brand, i) => (
<label className={styles.checkbox}>
  <input
    type="checkbox"
    checked={selectedBrands.includes(brand)}
    onChange={() => handleBrandToggle(brand)}
  />
  <span className={styles.checkmark}></span>
  <span className={styles.labelText}>{brand}</span>
</label>
))}

                </div>
              </div>
            </div>
          </div>
        </div>

        <section
          ref={productsRef}
          className={`${styles["productsContainer"]} ${styles["products-section"]}`}
        >
          {filteredProducts.length === 0 ? (
            <p className={styles.noProducts}>
              {lang === "en" ? "No products." : "Немає продуктів."}
            </p>
          ) : (
            filteredProducts.map((p) => {
              const description =
                lang === "en"
                  ? p.commentEn || p.comment
                  : p.comment;
              return (
                <div key={p.id} className={styles.product}>
                  <Link
                    to={`/shop/${p.id}?brand=${encodeURIComponent(p.brand || "")}`}
                    state={{ productTitle: p.title, brandName: p.brand }}
                    className={styles.productLink}
                  >
                    <img src={p.imageBase64} alt={p.title} />
                  </Link>
                                     <div className={styles.titleBlock}>
                      <h3 className={styles.brandName}>{p.brand}</h3>
                      <h3>
                        <Link
                          to={`/shop/${p.id}?brand=${encodeURIComponent(p.brand || "")}`}
                          state={{ productTitle: p.title, brandName: p.brand }}
                          className={styles.productLink}
                        >
                          {p.title}
                        </Link>
                      </h3>
                    </div>
                    <p>{description}</p>

                    {/* статус */}
                    <p
                      className={`${styles.status} ${
                        p.status === "В наявності"
                          ? styles.inStock
                          : styles.preOrder
                      }`}
                    >
                      {p.status}
                    </p>

                    {/* ціна + корзина */}
                    <div className={styles.priceRow}>
                      <span
                        className={`${styles.price} ${
                          !p.price ? styles.contractPrice : ""
                        }`}
                      >
                        {p.price ? `${p.price} ₴` : t("priceTitle")}
                      </span>

                      <button
                        className={styles.cartBtn}
                         onClick={() => handleAddToCart(p)}
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
              );
            })
          )}
        </section>
      </div>
      <Toast text={toast} />
    </>
  );
};

export default RestorationPageSection;
