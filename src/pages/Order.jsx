import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../js/firebase";
import { getCart, updateCartItemQty, removeFromCart, clearCart } from "../utils/cart";
import styles from "../css/Order.module.css";

const Order = () => {
  const [items, setItems] = useState(getCart());
  const [delivery, setDelivery] = useState("pickup");
  const [agree, setAgree] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [payment, setPayment] = useState("iban");
  const [saving, setSaving] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errors, setErrors] = useState({});
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

  const hasUnknownPrice = items.some((item) => !item.price);
  const total = hasUnknownPrice
    ? null
    : items.reduce((sum, item) => {
        const price =
          typeof item.price === "number" ? item.price : Number(item.price) || 0;
        return sum + price * item.qty;
      }, 0);

  const validate = () => {
    const nextErrors = {};
    if (!firstName.trim()) nextErrors.firstName = "Вкажіть ім’я";
    if (!lastName.trim()) nextErrors.lastName = "Вкажіть прізвище";
    if (!phone.trim()) nextErrors.phone = "Вкажіть телефон";
    if (delivery === "np") {
      if (!city.trim()) nextErrors.city = "Вкажіть місто";
      if (!warehouse.trim()) nextErrors.warehouse = "Вкажіть відділення";
    }
    if (!agree) nextErrors.agree = "Потрібна згода";
    return nextErrors;
  };

  if (orderSuccess) {
    return (
      <section className={styles.successWrapper}>
        <div className={styles.successText}>Дякуємо за замовлення</div>
      </section>
    );
  }

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>Оформлення замовлення</h1>

      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.card}>
            <h3>Особисті дані</h3>
            <input
              placeholder="* Ваше ім’я"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && <div className={styles.error}>{errors.firstName}</div>}
            <input
              placeholder="* Ваше прізвище"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && <div className={styles.error}>{errors.lastName}</div>}
            <input
              placeholder="* Номер телефону"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <div className={styles.error}>{errors.phone}</div>}
            <input
              placeholder="Ваш Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.card}>
            <h3>Оберіть спосіб доставки</h3>
            <label className={styles.radio}>
              <input
                type="radio"
                name="delivery"
                checked={delivery === "pickup"}
                onChange={() => setDelivery("pickup")}
              />
              Самовивіз із салону
            </label>
            <label className={styles.radio}>
              <input
                type="radio"
                name="delivery"
                checked={delivery === "np"}
                onChange={() => setDelivery("np")}
              />
              Нова пошта
            </label>
          </div>

          {delivery === "np" && (
            <div className={styles.card}>
              <h3>Вкажіть адресу доставки</h3>
              <input
                placeholder="* Місто"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {errors.city && <div className={styles.error}>{errors.city}</div>}
              <input
                placeholder="* Відділення"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
              />
              {errors.warehouse && <div className={styles.error}>{errors.warehouse}</div>}
            </div>
          )}

          <div className={styles.card}>
            <h3>Спосіб оплати</h3>
            <label className={styles.radio}>
              <input
                type="radio"
                name="payment"
                checked={payment === "iban"}
                onChange={() => setPayment("iban")}
              />
              Безготівковий розрахунок (IBAN)
            </label>
            <label className={styles.radio}>
              <input
                type="radio"
                name="payment"
                checked={payment === "cod"}
                onChange={() => setPayment("cod")}
              />
              Післяплата у відділенні пошти
            </label>
            <label className={styles.radio}>
              <input
                type="radio"
                name="payment"
                checked={payment === "pickup"}
                onChange={() => setPayment("pickup")}
              />
              Самовивіз + оплата в салоні
            </label>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.summary}>
            <div className={styles.summarySticky}>
              <h3>Ваше замовлення</h3>
              <div className={styles.summaryList}>
              {items.map((item) => (
                <div key={item.id} className={styles.summaryRow}>
                  <img src={item.image} alt={item.title} />
                  <div className={styles.summaryInfo}>
                    <div className={styles.brand}>{item.brand}</div>
                    <div className={styles.name}>{item.title}</div>
                    <div className={styles.desc}>
                      {isEn ? item.commentEn || item.comment : item.comment}
                    </div>
                    <div className={styles.qty}>
                      <button onClick={() => updateCartItemQty(item.id, -1)}>
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateCartItemQty(item.id, 1)}>
                        +
                      </button>
                    </div>
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
                    ×
                  </button>
                </div>
              ))}
              </div>

              <div className={styles.summaryRowSmall}>
                <span>Доставка</span>
                <span>За тарифами перевізника</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Разом</span>
                <strong>{hasUnknownPrice ? "Договірна" : `${total} ₴`}</strong>
              </div>

            <button
              className={styles.confirm}
              disabled={!agree || saving}
              onClick={async () => {
                if (saving) return;
                const nextErrors = validate();
                setErrors(nextErrors);
                if (Object.keys(nextErrors).length > 0) {
                  return;
                }
                setSaving(true);
                try {
                  const order = {
                    customer: { firstName, lastName, phone, email },
                    delivery: {
                      method: delivery,
                      city: delivery === "np" ? city : "",
                      warehouse: delivery === "np" ? warehouse : "",
                    },
                    payment,
                    items: getCart(),
                    total: hasUnknownPrice ? null : total,
                    totalLabel: hasUnknownPrice ? "Договірна" : `${total} ₴`,
                    createdAt: serverTimestamp(),
                  };
                  await addDoc(collection(db, "orders"), order);
                  clearCart();
                  setItems([]);
                  setOrderSuccess(true);
                } catch (err) {
                  console.error("Error saving order:", err);
                } finally {
                  setSaving(false);
                }
              }}
            >
              Підтвердити замовлення
            </button>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              Підтверджую замовлення і приймаю умови угоди
            </label>
            {errors.agree && <div className={styles.error}>{errors.agree}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Order;
