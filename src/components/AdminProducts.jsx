import React from "react";
import styles from "../css/AdminProducts.module.css";

// Import SVG icons for table actions
import EditIcon from "../assets/EditIcon.svg";
import DeleteIcon from "../assets/DeleteIcon.svg";

const AdminProducts = ({
  products = [],
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  return (
    <div className={styles.products}>
      {/* Top section with title and Add button */}
      <div className={styles.top}>
        <span className={styles.title}>Продукти</span>
        <button onClick={onAddProduct}>+ Додати продукт</button>
      </div>

      {/* Table wrapper */}
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Бренд</th>
              <th>Фото</th>
              <th>Назва продукту</th>
              <th>Статус</th>
              <th>Ціна</th>
              <th className={styles.iconCell}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              // визначаємо статус текст та колір
              const statusText =
                product.status === "В наявності" ? "В наявності" : "Під замовлення";
              const statusColor =
                product.status === "В наявності" ? "green" : "orange";

              return (
                <tr key={product.id}>
                    
                  <td>{index + 1}</td>
                                    <td>{product.brand}</td>
                  <td>
                    {product.imageBase64 ? (
                      <img
                        src={product.imageBase64}
                        alt={product.title}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td>{product.title}</td>
                  <td style={{ color: statusColor, fontSize: "16px"}}>
                    {statusText}
                  </td>
                  <td>{product.price ? `${product.price} грн.` : "Договірна"}</td>
                  <td className={`${styles.iconCell} ${styles.actionsCell}`}>
                    <img
                      src={EditIcon}
                      alt="Edit"
                      className={styles.icon}
                      onClick={() => onEditProduct(product)}
                    />
                    <img
                      src={DeleteIcon}
                      alt="Delete"
                      className={styles.icon}
                      onClick={() => onDeleteProduct(product.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
