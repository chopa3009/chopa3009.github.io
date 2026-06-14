import { useEffect, useState } from "react";
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

const statusMap = {
  new: "Нове",
  processing: "В обробці",
  done: "Виконано",
  cancelled: "Скасовано",
};

const statusClassMap = {
  new: "statusNew",
  processing: "statusProcessing",
  done: "statusDone",
  cancelled: "statusCancelled",
};

const STATUS_OPTIONS = [
  { value: "new", label: "Нове" },
  { value: "processing", label: "В обробці" },
  { value: "done", label: "Виконано" },
  { value: "cancelled", label: "Скасовано" },
];

const AdminOrderModal = ({ isOpen, order, onClose, onUpdateOrderStatus }) => {
  const [nextStatus, setNextStatus] = useState("new");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!order) {
      return;
    }

    setNextStatus(order.status || "new");
    setSaveError("");
    setIsSaving(false);
  }, [order]);

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
  const displayOrderId = order.orderNumber || order.id;
  const status = statusMap[order.status] || "Нове";
  const statusClass =
    styles[statusClassMap[order.status]] || styles.statusNew;
  const itemsCount = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + (item.qty || 0), 0)
    : 0;
  const customerRows = [
    { label: "Клієнт", value: name || "—" },
    { label: "Телефон", value: phone || "—" },
    { label: "Email", value: email || "—" },
    { label: "Дата", value: formatDate(order.createdAt) || "—" },
  ];
  const deliveryRows = [
    { label: "Доставка", value: delivery || "—" },
    { label: "Адреса", value: address || "—" },
    { label: "Оплата", value: payment || "—" },
  ];

  const handleStatusSave = async () => {
    if (!onUpdateOrderStatus || nextStatus === order.status) {
      return;
    }

    setIsSaving(true);
    setSaveError("");

    try {
      await onUpdateOrderStatus(order.id, nextStatus);
    } catch (error) {
      setSaveError("Не вдалося оновити статус замовлення");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <div className={styles.eyebrow}>Замовлення</div>
            <h3>№ {displayOrderId}</h3>
          </div>
          <button className={styles.close} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Статус</span>
            <span className={`${styles.statusBadge} ${statusClass}`}>
              {status}
            </span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Сума</span>
            <span className={styles.summaryValue}>{totalLabel}</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Товарів</span>
            <span className={styles.summaryValue}>{itemsCount}</span>
          </div>
        </div>

        <div className={styles.statusEditor}>
          <div className={styles.statusEditorInfo}>
            <div className={styles.sectionTitle}>Керування статусом</div>
            <div className={styles.statusEditorText}>
              Зміна статусу в адмінці також оновить повідомлення в Telegram.
            </div>
          </div>
          <div className={styles.statusEditorControls}>
            <select
              className={styles.statusSelect}
              value={nextStatus}
              onChange={(event) => setNextStatus(event.target.value)}
              disabled={isSaving}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={styles.statusSaveBtn}
              onClick={handleStatusSave}
              disabled={isSaving || nextStatus === order.status}
            >
              {isSaving ? "Зберігаю..." : "Зберегти статус"}
            </button>
          </div>
        </div>
        {saveError ? <div className={styles.statusError}>{saveError}</div> : null}

        <div className={styles.contentGrid}>
          <div className={styles.sectionCard}>
            <div className={styles.sectionTitle}>Клієнт</div>
            <div className={styles.section}>
              {customerRows.map((row) => (
                <div key={row.label} className={styles.detailRow}>
                  <span className={styles.detailLabel}>{row.label}</span>
                  <span className={styles.detailValue}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionTitle}>Деталі замовлення</div>
            <div className={styles.section}>
              {deliveryRows.map((row) => (
                <div key={row.label} className={styles.detailRow}>
                  <span className={styles.detailLabel}>{row.label}</span>
                  <span className={styles.detailValue}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.itemsCard}>
          <div className={styles.itemsTitle}>Товари</div>
          <div className={styles.itemsList}>
            {(order.items || []).map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <img src={item.image} alt={item.title} />
                <div className={styles.itemInfo}>
                  <div className={styles.itemBrand}>{item.brand}</div>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemMetaRow}>
                    <div className={styles.itemQty}>К-сть: {item.qty}</div>
                    <div className={styles.itemUnitPrice}>
                      {item.price ? `${item.price} ₴ / шт.` : "Договірна"}
                    </div>
                  </div>
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
