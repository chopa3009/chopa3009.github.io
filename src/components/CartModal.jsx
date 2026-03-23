import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../css/CartModal.module.css";
import {
  getCart,
  updateCartItemQty,
  removeFromCart,
} from "../utils/cart";
import removeIcon from "../assets/Remove.svg";

const CartModal = ({ isOpen, onClose }) => {
  const [items, setItems] = useState(getCart());
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";

  useEffect(() => {
    const sync = () => setItems(getCart());
    window.addEventListener("cartUpdated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cartUpdated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!isOpen) return null;

  const hasUnknownPrice = items.some((item) => !item.price);
  const total = hasUnknownPrice
    ? null
    : items.reduce((sum, item) => {
        const price = typeof item.price === "number" ? item.price : Number(item.price) || 0;
        return sum + price * item.qty;
      }, 0);
  const totalLabel = hasUnknownPrice ? "Договірна" : `${total} ₴`;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Кошик</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className={`${styles.list} ${items.length > 2 ? styles.listScroll : ""}`}>
          {items.length === 0 && (
            <div className={styles.empty}>Кошик порожній</div>
          )}
          {items.map((item) => (
            <div key={item.id} className={styles.row}>
              <img src={item.image} alt={item.title} />
              <div className={styles.info}>
                <div className={styles.brand}>{item.brand}</div>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.subtitle}>
                  {isEn ? item.commentEn || item.comment : item.comment}
                </div>
              </div>
              <div className={styles.qty}>
                <button
                  onClick={() => updateCartItemQty(item.id, -1)}
                  aria-label="Decrease"
                >
                  −
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => updateCartItemQty(item.id, 1)}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
              <div className={styles.price}>
                {item.price
                  ? `${item.price * item.qty} ₴`
                  : "Ціна договірна"}
              </div>
              <button
                className={styles.remove}
                onClick={() => removeFromCart(item.id)}
                aria-label="Remove"
              >
                <img src={removeIcon} alt="" />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.total}>
            <span>Сума замовлення:</span>
            <strong>{totalLabel}</strong>
          </div>
          <a className={styles.checkout} href="#/order" onClick={onClose}>
            Оформити замовлення
          </a>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
