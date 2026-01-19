import React from "react";
import styles from "../css/BrandModal.module.css";

const BrandModal = ({
  isOpen,
  brandName,
  setBrandName,
  onClose,
  onSave,
  isEditing,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="*Бренд"
          autoFocus
          className={styles.inputCenter}
        />

        <div className={styles.buttonGroup}>
          <button className={styles.cancel} onClick={onClose}>
            Скасувати
          </button>
          <button className={styles.save} onClick={onSave}>
            {isEditing ? "Зберегти" : "Додати"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandModal;
