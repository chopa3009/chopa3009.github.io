import React from 'react';
import styles from "../css/AdminBrands.module.css";

// Import SVG icons for table actions
import EditIcon from "../assets/EditIcon.svg";
import DeleteIcon from "../assets/DeleteIcon.svg";

const AdminBrands = ({ brands = [],
  brandName,
  setBrandName,
  editingBrandId,
  onAddBrand,
  onEditBrand,
  onUpdateBrand,
  onDeleteBrand,
}) => {
  return (
    <div className={styles.brands}>
      {/* Top section with title and Add button */}
      <div className={styles.top}>
        <span className={styles.title}>Бренди</span>
        <button onClick={onAddBrand}>+ Додати бренд</button>
      </div>

      {/* Table wrapper */}
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Назва бренду</th>
              <th className={styles.iconCell}>Редагувати</th>
              <th className={styles.iconCell}>Видалити</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, index) => (
              <tr key={brand.id}>
                <td>{index + 1}</td>
                <td>{brand.name}</td>
                <td className={styles.iconCell}>
                  <img 
                    src={EditIcon}
                    alt="Edit"
                    className={styles.icon}
                    onClick={() => onEditBrand(brand)}
                  />
                </td>
                <td className={styles.iconCell}>
                  <img
                    src={DeleteIcon}
                    alt="Delete"
                    className={styles.icon}
                    onClick={() => onDeleteBrand(brand.id)}
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

export default AdminBrands;
