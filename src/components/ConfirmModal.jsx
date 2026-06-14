import styles from "../css/ConfirmModal.module.css";

const ConfirmModal = ({
  isOpen,
  title = "Підтвердження",
  text,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{text}</p>

        <div className={styles.actions}>
          <button onClick={onCancel}>Скасувати</button>
          <button className={styles.danger} onClick={onConfirm}>
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
