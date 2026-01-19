// AdminPanel.jsx
import React, { useState, useEffect, useRef } from "react";

import EyeIcon from "../assets/open_eye.svg";
import EyeOffIcon from "../assets/crossed_eye.svg";

import styles from "../css/AdminPanel.module.css";
import Sidebar from "../components/AdminSideBar";
import Header from "../components/AdminHeader";
import MainContent from "../components/AdminMainContent";
import BrandModal from "../components/BrandModal";
import ProductModal from "../components/ProductModal";
import ConfirmModal from "../components/ConfirmModal";
import ErrorModal from "../components/ErrorModal";

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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("brands");

  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [brands, setBrands] = useState([]);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);

    const [errorModalOpen, setErrorModalOpen] = useState(false);
const [errorText, setErrorText] = useState("");

  // product form
  const [productForm, setProductForm] = useState({
    title: "",
     price: "",
    sku: "",
    comment: "",
    description: "",
    descriptionEn: "",
    brand: "",
    imageBase64: "",
  });

  const dropRef = useRef();

  // ===== Open Add Brands Modal =====
  const openAddBrandModal = () => {
    setEditingBrandId(null);
    setBrandName("");
    setIsBrandModalOpen(true);
  };
  // ===== Open Edit Brands Modal =====
  const openEditBrandModal = (brand) => {
    setEditingBrandId(brand.id);
    setBrandName(brand.name);
    setIsBrandModalOpen(true);
  };
  // ===== Close Brands Modal =====
  const closeBrandModal = () => {
    setIsBrandModalOpen(false);
    setBrandName("");
    setEditingBrandId(null);
  };
  // ===== Open Add Products Modal =====
  const openAddProductModal = () => {
    setEditingProductId(null);
    setProductForm({
      title: "",
       price: "",
  sku: "",
  comment: "",
      description: "",
      descriptionEn: "",
      brand: "",
      imageBase64: "",
    });
    setIsProductModalOpen(true);
  };
  // ===== Open Edit Products Modal =====
  const openEditProductModal = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      ...product,
      image: null, // новий файл ще не вибраний
      imagePreview: product.imageBase64 || null, // беремо існуючу картинку
    });
    setIsProductModalOpen(true);
  };
  // ===== Close Products Modal =====
  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProductId(null);
  };

  // ===== Auth listener =====
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        loadProducts();
        loadBrands();
      } else {
        setUser(null);
        setProducts([]);
        setBrands([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // ===== Handle login =====
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(""); // reset previous errors
    try {
      await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      setLoginData({ email: "", password: "" });
    } catch (err) {
      // Map Firebase errors to friendly messages
      switch (err.code) {
        case "auth/wrong-password":
          setLoginError("Невірний пароль");
          break;
        case "auth/user-not-found":
          setLoginError("Користувача з таким email не знайдено");
          break;
        case "auth/invalid-email":
          setLoginError("Невірний формат email");
          break;
        case "auth/invalid-credential":
          setLoginError("Невірні облікові дані");
          break;
        default:
          setLoginError(err.message);
      }
    }
  };

  const imageToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  // ===== Load Brands =====
  const loadBrands = async () => {
    try {
      const q = query(collection(db, "brands"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBrands(data);
    } catch (err) {
      console.error("Error loading brands:", err);
    }
  };

  // ===== Add Brand =====
  const addBrand = async () => {
    if (!brandName.trim()){
    setErrorText("Введіть назву бренду");
    setErrorModalOpen(true);
    return;
  }

    try {
      await addDoc(collection(db, "brands"), {
        name: brandName.trim(),
        createdAt: serverTimestamp(),
      });

      setBrandName("");
      loadBrands();
      closeBrandModal();
    } catch (err) {
      console.error(err);
      alert("Error adding brand");
    }
  };

  // ===== Save Editing Brand =====
  const updateBrand = async () => {
    if (!brandName.trim()) {
    setErrorText("Введіть назву бренду");
    setErrorModalOpen(true);
    return;
  }

    try {
      const brandRef = doc(db, "brands", editingBrandId);
      await updateDoc(brandRef, {
        name: brandName.trim(),
      });

      setEditingBrandId(null);
      setBrandName("");
      loadBrands();
      closeBrandModal();
    } catch (err) {
      console.error(err);
      alert("Error updating brand");
    }
  };

  // ===== Delete Brand =====
  const requestDeleteBrand = (id) => {
    setBrandToDelete(id);
    setIsDeleteModalOpen(true);
  };
  const confirmDeleteBrand = async () => {
    try {
      await deleteDoc(doc(db, "brands", brandToDelete));
      loadBrands();
      closeDeleteModal();
    } catch (err) {
      console.error(err);
      alert("Error deleting brand");
    }
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setBrandToDelete(null);
  };

// ===== Add Product =====
const addProduct = async () => {
  const { title, description, descriptionEn, brand, status, imageBase64, price, comment, sku } = productForm;

  if (!title || !brand || !imageBase64 || !description || !descriptionEn || !status) {
    setErrorText("Заповніть всі поля та додайте картинку");
    setErrorModalOpen(true);
    return;
  }

  try {
    await addDoc(collection(db, "products"), {
      title,
       price,
  sku,
  comment,
      description,
      descriptionEn,
      brand,
      status,
      imageBase64, // save preview as imageBase64
      createdAt: serverTimestamp(),
    });

    // Reset form
    setProductForm({
      title: "",
       price: "",
  sku: "",
  comment: "",
      description: "",
      descriptionEn: "",
      brand: "",
      status: "",
      image: null,
      imagePreview: null,
      imageBase64: "",
    });

    loadProducts();
    closeProductModal();
  } catch (e) {
    console.error(e);
  }
};

// ===== Update Product =====
const updateProduct = async () => {
  const { title, description, descriptionEn, brand, status, price, sku, comment, imagePreview, imageBase64 } = productForm;

    if (!title || !brand || !imageBase64 || !description || !descriptionEn || !status) {
    setErrorText("Заповніть всі поля та додайте картинку");
    setErrorModalOpen(true);
    return;
  }

  try {
    await updateDoc(doc(db, "products", editingProductId), {
      title,
      price,
      sku,
      comment,
      description,
      descriptionEn,
      brand,
      status,
      imageBase64: imagePreview || imageBase64, // keep old image if no new one selected
    });

    // Reset form
    setProductForm({
      title: "",
       price: "",
  sku: "",
  comment: "",
      description: "",
      descriptionEn: "",
      brand: "",
      status: "",
      image: null,
      imagePreview: null,
      imageBase64: "",
    });

    loadProducts();
    closeProductModal();
  } catch (e) {
    console.error(e);
  }
};



  // ===== Delete Product =====
  const requestDeleteProduct = (id) => {
    setProductToDelete(id);
    setIsDeleteProductModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      await deleteDoc(doc(db, "products", productToDelete));
      loadProducts();
      closeDeleteProductModal();
    } catch (e) {
      console.error(e);
    }
  };

  const closeDeleteProductModal = () => {
    setIsDeleteProductModalOpen(false);
    setProductToDelete(null);
  };

  // ===== Load Products =====
  const loadProducts = async () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProducts(data); // ✅ array
  };

  return (
    <>
      <div className={styles.adminPanel}>
        {!user && (
          <div id="loginDiv" className={styles.loginDiv}>
            <form id="loginForm" onSubmit={handleLogin}>
              <h1 className={styles.h1}>Log in</h1>
              <label className={styles.required}>
                Email
                <input
                  type="email"
                  id="email"
                  placeholder="Введіть свій email"
                  required
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
              </label>
              <label className={styles.required}>
                Password
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Введіть свій пароль"
                    required
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                  <span
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <img
                      src={showPassword ? EyeOffIcon : EyeIcon} // imported from assets
                      alt={showPassword ? "Hide password" : "Show password"}
                    />
                  </span>
                </div>
              </label>

              <button type="submit">Login</button>

              {loginError && <p className={styles.loginError}>{loginError}</p>}
            </form>
          </div>
        )}

        {user && (
          <>
            <Sidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
            <Header search={search} setSearch={setSearch} />
            <MainContent
              search={search}
              brands={brands}
              activeSection={activeSection}
              onAddBrand={openAddBrandModal}
              onEditBrand={openEditBrandModal}
              onDeleteBrand={requestDeleteBrand}
              brandName={brandName}
              setBrandName={setBrandName}
              editingBrandId={editingBrandId}
              products={products}
              onAddProduct={openAddProductModal}
              onEditProduct={openEditProductModal}
              onDeleteProduct={requestDeleteProduct}
            />
            <BrandModal
              isOpen={isBrandModalOpen}
              brandName={brandName}
              setBrandName={setBrandName}
              onClose={closeBrandModal}
              onSave={editingBrandId ? updateBrand : addBrand}
              isEditing={!!editingBrandId}
            />
            <ConfirmModal
              isOpen={isDeleteModalOpen}
              title="Видалити бренд?"
              text="Ви впевнені, що хочете видалити цей бренд? Цю дію неможливо скасувати."
              onCancel={closeDeleteModal}
              onConfirm={confirmDeleteBrand}
            />
            <ProductModal
              isOpen={isProductModalOpen}
              productForm={productForm}
              setProductForm={setProductForm}
              onSave={editingProductId ? updateProduct : addProduct}
              onClose={closeProductModal}
              isEditing={!!editingProductId}
              brands={brands}
            />

            <ConfirmModal
              isOpen={isDeleteProductModalOpen}
              title="Видалити продукт?"
              text="Ви впевнені, що хочете видалити продукт? Цю дію неможливо скасувати."
              onCancel={closeDeleteProductModal}
              onConfirm={confirmDeleteProduct}
            />
            <ErrorModal
  isOpen={errorModalOpen}
  text={errorText}
  onClose={() => setErrorModalOpen(false)}
/>
          </>
        )}
      </div>
    </>
  );
};

export default AdminPanel;
