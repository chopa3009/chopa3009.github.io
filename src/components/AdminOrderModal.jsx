import styles from "../css/AdminOrderModal.module.css";

const formatDate = (ts) => {
  try {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return new Intl.DateTimeFormat("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
};

const AdminOrderModal = ({ isOpen, order, onClose }) => {
  if (!isOpen || !order) return null;

  const name = `${order.customer?.firstName || ""} ${
    order.customer?.lastName || ""
  }`.trim();
  const phone = order.customer?.phone || "";
  const email = order.customer?.email || "";
  const delivery =
    order.delivery?.method === "np" ? "Нова пошта" : "Самовивіз";
  const address =
    order.delivery?.method === "np"
      ? `${order.delivery?.city || ""}, ${order.delivery?.warehouse || ""}`
      : "—";
  const paymentMap = {
    iban: "IBAN",
    cod: "Післяплата",
    pickup: "Самовивіз",
  };
  const payment = paymentMap[order.payment] || "";
  const totalLabel =
    order.totalLabel ||
    (order.total !== null && order.total !== undefined
      ? `${order.total} ₴`
      : "Договірна");

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Замовлення</h3>
          <button className={styles.close} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.section}>
          <div><strong>Клієнт:</strong> {name}</div>
          <div><strong>Телефон:</strong> {phone}</div>
          <div><strong>Email:</strong> {email}</div>
          <div><strong>Дата:</strong> {formatDate(order.createdAt)}</div>
        </div>

        <div className={styles.section}>
          <div><strong>Доставка:</strong> {delivery}</div>
          <div><strong>Адреса:</strong> {address}</div>
          <div><strong>Оплата:</strong> {payment}</div>
          <div><strong>Сума:</strong> {totalLabel}</div>
        </div>

        <div className={styles.items}>
          <div className={styles.itemsTitle}>Товари</div>
          <div className={styles.itemsList}>
            {(order.items || []).map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <img src={item.image} alt={item.title} />
                <div className={styles.itemInfo}>
                  <div className={styles.itemBrand}>{item.brand}</div>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemQty}>К-сть: {item.qty}</div>
                </div>
                <div className={styles.itemPrice}>
                  {item.price ? `${item.price * item.qty} ₴` : "Договірна"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderModal;
