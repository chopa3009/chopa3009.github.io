import { useEffect, useState } from "react";
import { getCartCount } from "../utils/cart";
import CartIcon from "../assets/Cart_header.svg";
import styles from "../css/CartBadge.module.css";
import { Link } from "react-router-dom";

const CartBadge = ({ onOpen }) => {
  const [count, setCount] = useState(getCartCount());

  const update = () => setCount(getCartCount());

  useEffect(() => {
    window.addEventListener("cartUpdated", update);
    window.addEventListener("storage", update); // 🔥 інші вкладки

    return () => {
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  if (onOpen) {
    return (
      <button
        type="button"
        className={`${styles.cart} header-cart`}
        onClick={onOpen}
        aria-label="Open cart"
      >
        <img src={CartIcon} alt="Cart" />
        {count > 0 && <span className={styles.badge}>{count}</span>}
      </button>
    );
  }

  return (
    <Link to="/cart" className={`${styles.cart} header-cart`}>
      <img src={CartIcon} alt="Cart" />
      {count > 0 && <span className={styles.badge}>{count}</span>}
    </Link>
  );
};

export default CartBadge;
