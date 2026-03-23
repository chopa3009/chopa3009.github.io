import styles from "../css/Toast.module.css";

const Toast = ({ text }) => {
  if (!text) return null;

  return (
    <div className={styles.toast}>
      {text}
    </div>
  );
};

export default Toast;
