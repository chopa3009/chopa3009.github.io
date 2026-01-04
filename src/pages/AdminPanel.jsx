// AdminPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import styles from "../css/AdminPanel.module.css";
import { db } from "../js/firebase";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

// ===== Firebase config =====
const firebaseConfig = {
  apiKey: "AIzaSyD2rkpPXqqwYQ4JctT8Gu6E6mIytoJqPGo",
  authDomain: "bove-948cf.firebaseapp.com",
  projectId: "bove-948cf",
  storageBucket: "bove-948cf.firebasestorage.app",
  messagingSenderId: "36414468939",
  appId: "1:36414468939:web:2907567ba0986373482ece",
  measurementId: "G-QH31QNJXWF",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    descriptionEn: "",
    brand: "",
    image: null,
    imagePreview: null,
  });

  const dropRef = useRef();

  // ===== Auth listener =====
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        loadProducts();
      } else {
        setUser(null);
        setProducts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // ===== Handle login =====
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      setLoginData({ email: "", password: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => signOut(auth);

  // ===== Drag & Drop =====
  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add(styles.dragOver);
  };
  const handleDragLeave = () => {
    dropRef.current.classList.remove(styles.dragOver);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove(styles.dragOver);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageFile(file);
  };

  const handleImageFile = (file) => {
    const maxSizeMB = 1;
    if (file.size > maxSizeMB * 1024 * 1024) {
      return alert(`Image size should not exceed ${maxSizeMB} MB`);
    }
    const reader = new FileReader();
    reader.onload = () =>
      setFormData((prev) => ({ ...prev, image: file, imagePreview: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "image" && files[0]) handleImageFile(files[0]);
    else setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const imageToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  // ===== Add / Edit product =====
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const { title, description, descriptionEn, brand, image } = formData;
    if (!title || !description || !brand) return alert("Please fill required fields");

    let imageBase64 = formData.imagePreview;
    if (image && !imageBase64) imageBase64 = await imageToBase64(image);

    try {
      const productData = {
        title: title.slice(0, 50),
        brand: brand.slice(0, 30),
        description: description.slice(0, 400),
        descriptionEn: descriptionEn.slice(0, 400),
        imageBase64,
      };

      if (editingId) {
        if (!window.confirm("Are you sure you want to update this product?")) return;
        const docRef = doc(db, "products", editingId);
        await updateDoc(docRef, productData);
        setEditingId(null);
      } else {
        if (!imageBase64) return alert("Please select an image for new product");
        await addDoc(collection(db, "products"), { ...productData, createdAt: serverTimestamp() });
      }

      setFormData({
        title: "",
        description: "",
        descriptionEn: "",
        brand: "",
        image: null,
        imagePreview: null,
      });
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  // ===== Load Products =====
  const loadProducts = async () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const grouped = {};
    snapshot.forEach((docSnap) => {
      const product = docSnap.data();
      const brand = product.brand || "No Brand";
      if (!grouped[brand]) grouped[brand] = [];
      grouped[brand].push({ id: docSnap.id, ...product });
    });
    setProducts(grouped);
  };

  // ===== Edit / Delete =====
  const editProduct = (id, product) => {
    if (!window.confirm("Are you sure you want to edit this product?")) return;
    setEditingId(id);
    setFormData({
      title: product.title,
      description: product.description,
      descriptionEn: product.descriptionEn || "",
      brand: product.brand,
      image: null,
      imagePreview: product.imageBase64,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  return (
    <>
      <h1>Admin Panel / Адмін панель</h1>
      <div className={styles.adminPanel}>
        {!user && (
          <div id="loginDiv" className={styles.loginDiv}>
            <form id="loginForm" onSubmit={handleLogin}>
              <input
                type="email"
                id="email"
                placeholder="Email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
              <input
                type="password"
                id="password"
                placeholder="Password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <button type="submit">Login / Логін</button>
            </form>
          </div>
        )}

        {user && (
          <div id="adminDiv" className={styles.adminDiv}>
            <h2>Add / Edit Product / Додати / Відредагувати продукт</h2>
            <form id="productForm" onSubmit={handleProductSubmit}>
              <label>
                Title (EN) / Назва: <small>*Max 50 characters</small>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={50}
                />
              </label>

              <label>
                Description (UA) / Опис українською: <small>*Max 400 characters</small>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  maxLength={400}
                />
              </label>

              <label>
                Description (EN) / Опис англійською: <small>*Max 400 characters</small>
                <textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={handleChange}
                  required
                  maxLength={400}
                />
              </label>

              {/* --- Обгортка для бренду та прев'ю --- */}
              <div className={styles.formGroup}>
                <label>
                  Brand / Бренд: <small>*Choose one brand</small>
                  <select
                    id="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select Brand
                    </option>
                    <option value="Brae">Brae</option>
                    <option value="Dr. Sorbie">Dr. Sorbie</option>
                    <option value="Kis">Kis</option>
                    <option value="Tempting">Tempting</option>
                    <option value="Viart">Viart</option>
                  </select>
                </label>

                <label
                  ref={dropRef}
                  className={styles.dropZone}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className={styles.previewImg}
                    />
                  ) : (
                    "Drag & Drop Image Here / або виберіть файл"
                  )}
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </label>
              </div>

              <button type="submit">Save Product / Зберегти продукт</button>
            </form>

            <h2>Products / Продукти</h2>
            <div id="productsContainer" className={styles.productsContainer}>
              {Object.entries(products).map(([brand, items]) => (
                <div key={brand} className={styles.brandGroup}>
                  <h3>{brand}</h3>
                  <div className={styles.productsGrid}>
                    {items.map((p) => (
                      <div key={p.id} className={styles.product}>
                        {p.imageBase64 && (
                          <img src={p.imageBase64} alt={p.title} width={100} />
                        )}
                        <h4>{p.title}</h4>
                        <p className={styles.descUa}>
                          <strong>UA:</strong> {p.description}
                        </p>
                        <p className={styles.descEn}>
                          <strong>EN:</strong> {p.descriptionEn}
                        </p>
                        <button
                          className={styles.editBtn}
                          onClick={() => editProduct(p.id, p)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => deleteProduct(p.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button id="logoutBtn" onClick={handleLogout}>
              Logout / Вийти
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;
