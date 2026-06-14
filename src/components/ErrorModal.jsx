import React from "react";
import styles from "../css/ConfirmModal.module.css"; // reuse same CSS as ConfirmModal

const ErrorModal = ({ isOpen, title = "Помилка", text, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{text}</p>

        <div className={styles.actions}>
          <button className={styles.danger} onClick={onClose}>
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
