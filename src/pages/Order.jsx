import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../js/firebase";
import { getCart, updateCartItemQty, removeFromCart, clearCart } from "../utils/cart";
import styles from "../css/Order.module.css";

const generateOrderNumber = () => {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const timePart = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(
    2,
    "0"
  )}${String(now.getSeconds()).padStart(2, "0")}`;
  const suffix = String(Math.floor(Math.random() * 1000)).padStart(3, "0");

  return `BOVE-${datePart}-${timePart}-${suffix}`;
};

const Order = () => {
  const [items, setItems] = useState(getCart());
  const [delivery, setDelivery] = useState("");
  const [agree, setAgree] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [payment, setPayment] = useState("");
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

  const isPersonalComplete =
    firstName.trim() !== "" && lastName.trim() !== "" && phone.trim() !== "";
  const isDeliveryStepActive = isPersonalComplete;
  const isDeliverySelected = delivery !== "";
  const isAddressComplete =
    delivery === "pickup" || (delivery === "np" && city.trim() !== "" && warehouse.trim() !== "");
  const isPaymentStepActive =
    isDeliveryStepActive && isDeliverySelected && isAddressComplete;

  const validate = () => {
    const nextErrors = {};
    if (!firstName.trim()) nextErrors.firstName = "Вкажіть ім’я";
    if (!lastName.trim()) nextErrors.lastName = "Вкажіть прізвище";
    if (!phone.trim()) nextErrors.phone = "Вкажіть телефон";
    if (!delivery) nextErrors.delivery = "Оберіть спосіб доставки";
    if (delivery === "np") {
      if (!city.trim()) nextErrors.city = "Вкажіть місто";
      if (!warehouse.trim()) nextErrors.warehouse = "Вкажіть відділення";
    }
    if (!payment) nextErrors.payment = "Оберіть спосіб оплати";
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
          <div className={`${styles.card} ${styles.personalDataCard}`}>
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
              className={styles.phoneInput}
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

          <div
            className={`${styles.card} ${!isDeliveryStepActive ? styles.cardInactive : ""}`}
          >
            <h3>Оберіть спосіб доставки</h3>
            <fieldset className={styles.cardFieldset}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="delivery"
                  checked={delivery === "pickup"}
                  disabled={!isDeliveryStepActive}
                  onChange={() => setDelivery("pickup")}
                />
                Самовивіз із салону
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="delivery"
                  checked={delivery === "np"}
                  disabled={!isDeliveryStepActive}
                  onChange={() => setDelivery("np")}
                />
                Нова пошта
              </label>
            </fieldset>
            {errors.delivery && <div className={styles.error}>{errors.delivery}</div>}
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

          <div
            className={`${styles.card} ${!isPaymentStepActive ? styles.cardInactive : ""}`}
          >
            <h3>Спосіб оплати</h3>
            <fieldset className={styles.cardFieldset}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "iban"}
                  disabled={!isPaymentStepActive}
                  onChange={() => setPayment("iban")}
                />
                Безготівковий розрахунок (IBAN)
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "pickup"}
                  disabled={!isPaymentStepActive}
                  onChange={() => setPayment("pickup")}
                />
                Самовивіз + оплата в салоні
              </label>
            </fieldset>
            {errors.payment && <div className={styles.error}>{errors.payment}</div>}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.summary}>
            <div className={styles.summarySticky}>
              <h3>Ваше замовлення</h3>
              <div className={styles.summaryList}>
              {items.map((item) => (
                <div key={item.id} className={styles.summaryRow}>
                  <img
                    className={`${styles.summaryImage} ${
                      item.title === "Gorgeous Volume Conditioner"
                        ? styles.gorgeousVolumeConditionerImage
                        : ""
                    }`}
                    src={item.image}
                    alt={item.title}
                  />
                  <div className={styles.summaryInfo}>
                    <div className={styles.brandRow}>
                      <div className={styles.brand}>{item.brand}</div>
                      <button
                        className={styles.remove}
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove"
                      >
                        <img
                          src="data:image/svg+xml,%3csvg%20width='17'%20height='19'%20viewBox='0%200%2017%2019'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M10.5%207.5V14.5M6.5%207.5V14.5M2.5%203.5V15.3C2.5%2016.4201%202.5%2016.9798%202.71799%2017.4076C2.90973%2017.7839%203.21547%2018.0905%203.5918%2018.2822C4.0192%2018.5%204.57899%2018.5%205.69691%2018.5H11.3031C12.421%2018.5%2012.98%2018.5%2013.4074%2018.2822C13.7837%2018.0905%2014.0905%2017.7839%2014.2822%2017.4076C14.5%2016.9802%2014.5%2016.421%2014.5%2015.3031V3.5M2.5%203.5H4.5M2.5%203.5H0.5M4.5%203.5H12.5M4.5%203.5C4.5%202.56812%204.5%202.10241%204.65224%201.73486C4.85523%201.24481%205.24432%200.855229%205.73438%200.652241C6.10192%200.5%206.56812%200.5%207.5%200.5H9.5C10.4319%200.5%2010.8978%200.5%2011.2654%200.652241C11.7554%200.855229%2012.1447%201.24481%2012.3477%201.73486C12.4999%202.1024%2012.5%202.56812%2012.5%203.5M12.5%203.5H14.5M14.5%203.5H16.5'%20stroke='%23212121'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e"
                          alt=""
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    <div className={styles.name}>{item.title}</div>
                    <div className={styles.desc}>
                      {isEn ? item.commentEn || item.comment : item.comment}
                    </div>
                    <div className={styles.qtyPriceRow}>
                      <div className={styles.qty}>
                        <button onClick={() => updateCartItemQty(item.id, -1)}>
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateCartItemQty(item.id, 1)}>
                          +
                        </button>
                      </div>
                      <div className={styles.price}>
                        {item.price
                          ? `${item.price * item.qty} ₴`
                          : "Ціна договірна"}
                      </div>
                    </div>
                  </div>
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
                  const orderNumber = generateOrderNumber();
                  const order = {
                    orderNumber,
                    status: "new",
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
              <span className={styles.checkboxHit}>
                <input
                  type="checkbox"
                  checked={agree}
                  disabled={!isPaymentStepActive}
                  onChange={(e) => setAgree(e.target.checked)}
                />
              </span>
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
