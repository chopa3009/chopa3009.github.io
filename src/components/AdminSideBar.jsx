import styles from "../css/AdminSideBar.module.css";
import logo from '../assets/Logo.svg';

const AdminSideBar = ({ activeSection, setActiveSection }) => {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.headerLogo}>
        <img src={logo} alt="Logo" />
      </div>
      <ul>
        <li
          className={activeSection === "brands" ? styles.active : ""}
          onClick={() => setActiveSection("brands")}
        >
          Бренди
        </li>
        <li
          className={activeSection === "products" ? styles.active : ""}
          onClick={() => setActiveSection("products")}
        >
          Продукти
        </li>
        <li
          className={activeSection === "orders" ? styles.active : ""}
          onClick={() => setActiveSection("orders")}
        >
          Замовлення
        </li>
      </ul>
    </nav>
  );
};

export default AdminSideBar;
