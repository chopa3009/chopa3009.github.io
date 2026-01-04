import { useEffect, useState, useRef } from "react";
import { db } from "../js/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import styles from "../css/Shop.module.css";

const ALL_PRODUCTS = "ALL_PRODUCTS";

const RestorationPageSection = ({ openModal }) => {
  const { t, i18n } = useTranslation();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeBrand, setActiveBrand] = useState(ALL_PRODUCTS);

  const productsRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const q = query(
          collection(db, "products"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const allProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const brandSet = new Set(allProducts.map(p => p.brand));

        setProducts(allProducts);
        setBrands([ALL_PRODUCTS, ...Array.from(brandSet)]);
        setActiveBrand(ALL_PRODUCTS);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    loadProducts();
  }, []);

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
    activeBrand === ALL_PRODUCTS
      ? products
      : products.filter(
          p => p.brand?.toLowerCase() === activeBrand.toLowerCase()
        );

  const lang = i18n.language === "en" ? "en" : "ua";

  return (
    <div className={styles["restoration-page-section-element-state"]}>
      {/* Brands & Button */}
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
                  <div key={i} className={styles._restorations}>
                    <div
                      className={`${styles["text-regular"]} ${
                        activeBrand === brand ? styles.activeBrand : ""
                      }`}
                      onClick={() => handleBrandClick(brand)}
                    >
                      {brand === ALL_PRODUCTS
                        ? t("allProducts")
                        : brand}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.buttons} onClick={openModal}>
            <div className="text_label bovebutton16regulardark">
              {t("getPrice")}
            </div>
          </div>
        </div>

        <div className={styles["footnote-price"]}>
          <p
            className={`${styles["text-footnote"]} bovebutton16regulardark`}
          >
            {t("brandsFootnote")}
          </p>
        </div>
      </div>

      {/* Products */}
      <section
        ref={productsRef}
        className={`${styles["productsContainer"]} ${styles["products-section"]}`}
      >
        {filteredProducts.length === 0 ? (
          <p className={styles.noProducts}>
            {lang === "en" ? "No products." : "Немає продуктів."}
          </p>
        ) : (
          filteredProducts.map(p => {
            const description =
              lang === "en"
                ? p.descriptionEn || p.description
                : p.description;

            return (
              <div key={p.id} className={styles.product}>
                <img src={p.imageBase64} alt={p.title} />
                <h3>{p.title}</h3>
                <p>{description}</p>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default RestorationPageSection;
