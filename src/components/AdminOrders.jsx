import React, { useState } from "react";
import styles from "../css/AdminOrders.module.css";
import OrderModal from "./AdminOrderModal";

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

const AdminOrders = ({ orders = [] }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className={styles.orders}>
      <div className={styles.top}>
        <span className={styles.title}>Замовлення</span>
      </div>

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Клієнт</th>
              <th>Телефон</th>
              <th>Доставка</th>
              <th>Оплата</th>
              <th>Товарів</th>
              <th>Сума</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const name = `${order.customer?.firstName || ""} ${
                order.customer?.lastName || ""
              }`.trim();
              const phone = order.customer?.phone || "";
              const delivery =
                order.delivery?.method === "np"
                  ? "Нова пошта"
                  : "Самовивіз";
              const paymentMap = {
                iban: "IBAN",
                cod: "Післяплата",
                pickup: "Самовивіз",
              };
              const payment = paymentMap[order.payment] || "";
              const itemsCount = Array.isArray(order.items)
                ? order.items.reduce((sum, i) => sum + (i.qty || 0), 0)
                : 0;
              const totalLabel =
                order.totalLabel ||
                (order.total !== null && order.total !== undefined
                  ? `${order.total} ₴`
                  : "Договірна");
              const date = formatDate(order.createdAt);

              return (
                <tr key={order.id} onClick={() => setSelected(order)}>
                  <td>{index + 1}</td>
                  <td>{name}</td>
                  <td>{phone}</td>
                  <td>{delivery}</td>
                  <td>{payment}</td>
                  <td>{itemsCount}</td>
                  <td>{totalLabel}</td>
                  <td>{date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <OrderModal
        isOpen={Boolean(selected)}
        order={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};

export default AdminOrders;
