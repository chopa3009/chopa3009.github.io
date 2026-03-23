import React from "react";
import styles from "../css/AdminPortfolio.module.css";

import EditIcon from "../assets/EditIcon.svg";
import DeleteIcon from "../assets/DeleteIcon.svg";

const AdminPortfolio = ({ items = [], onAddPortfolio, onEditPortfolio, onDeletePortfolio }) => {
  return (
    <div className={styles.portfolio}>
      <div className={styles.top}>
        <span className={styles.title}>Портфоліо</span>
        <button onClick={onAddPortfolio}>+ Додати запис</button>
      </div>

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>До</th>
              <th>Після</th>
              <th>Тайтл</th>
              <th className={styles.iconCell}>Редагувати</th>
              <th className={styles.iconCell}>Видалити</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>
                  {item.beforeBase64 ? (
                    <img
                      src={item.beforeBase64}
                      alt="Before"
                      width={60}
                      height={80}
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  {item.afterBase64 ? (
                    <img
                      src={item.afterBase64}
                      alt="After"
                      width={60}
                      height={80}
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className={styles.textCell}>{item.title}</td>
                <td className={styles.iconCell}>
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className={styles.icon}
                    onClick={() => onEditPortfolio(item)}
                  />
                </td>
                <td className={styles.iconCell}>
                  <img
                    src={DeleteIcon}
                    alt="Delete"
                    className={styles.icon}
                    onClick={() => onDeletePortfolio(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPortfolio;
