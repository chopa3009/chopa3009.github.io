import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../css/CartModal.module.css";
import {
  getCart,
  updateCartItemQty,
  removeFromCart,
} from "../utils/cart";
import removeIcon from "../assets/Remove.svg";
import closeIcon from "../assets/ModalCloseButton.svg";
import addPlusIcon from "../assets/Add_Plus.svg";
import removeMinusIcon from "../assets/Remove_Minus.svg";

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

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

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
            <img src={closeIcon} alt="" />
          </button>
        </div>

        <div className={`${styles.list} ${items.length > 2 ? styles.listScroll : ""}`}>
          {items.length === 0 && (
            <div className={styles.empty}>Кошик порожній</div>
          )}
          {items.map((item) => (
            <div key={item.id} className={styles.row}>
              <img className={styles.productImage} src={item.image} alt={item.title} />
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
                  <img src={removeMinusIcon} alt="" />
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => updateCartItemQty(item.id, 1)}
                  aria-label="Increase"
                >
                  <img src={addPlusIcon} alt="" />
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
            <span className={styles.totalLabel}>Сума замовлення:</span>
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
