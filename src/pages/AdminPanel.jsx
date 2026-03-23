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
import PortfolioModal from "../components/PortfolioModal";
import ConfirmModal from "../components/ConfirmModal";
import ErrorModal from "../components/ErrorModal";

import { db} from "../js/firebase";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
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

/* ================= Firebase ================= */
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

/* ================= Component ================= */
const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("brands");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);

  /* ---------- Auth ---------- */
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ---------- Brand modal ---------- */
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  /* ---------- Product modal ---------- */
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);

  /* ---------- Portfolio modal ---------- */
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState(null);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [isDeletePortfolioModalOpen, setIsDeletePortfolioModalOpen] =
    useState(false);

  /* ---------- Error modal ---------- */
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorText, setErrorText] = useState("");

  /* ---------- Product form ---------- */
  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    sku: "",
    comment: "",
    commentEn: "",
    isHit: false,
    description: "",
    descriptionEn: "",
    brand: "",
    status: "",
    imageBase64: "",
    imagePreview: null,
  });

  /* ---------- Portfolio form ---------- */
  const [portfolioForm, setPortfolioForm] = useState({
    beforeBase64: "",
    afterBase64: "",
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
  });

  const PORTFOLIO_CACHE_KEY = "admin_portfolio_cache";
  const PORTFOLIO_CACHE_TTL = 60 * 60 * 1000; // 1 hour

  /* ================= Auth listener ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        loadProducts();
        loadBrands();
        loadPortfolio();
        loadOrders();
      } else {
        setUser(null);
        setProducts([]);
        setBrands([]);
        setPortfolioItems([]);
        setOrders([]);
      }
    });
    return () => unsub();
  }, []);

  /* ================= Auth ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      setLoginData({ email: "", password: "" });
    } catch (err) {
      const map = {
        "auth/wrong-password": "Невірний пароль",
        "auth/user-not-found": "Користувача не знайдено",
        "auth/invalid-email": "Невірний email",
        "auth/invalid-credential": "Невірні облікові дані",
      };
      setLoginError(map[err.code] || err.message);
    }
  };

  /* ================= Load data ================= */
  const loadBrands = async () => {
    const q = query(collection(db, "brands"), orderBy("createdAt", "asc"));
    const snap = await getDocs(q);
    setBrands(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const loadProducts = async () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const loadOrders = async () => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  /* ================= Portfolio (cache + load) ================= */
  const getCachedPortfolio = () => {
    try {
      const cached = localStorage.getItem(PORTFOLIO_CACHE_KEY);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > PORTFOLIO_CACHE_TTL) {
        localStorage.removeItem(PORTFOLIO_CACHE_KEY);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  };

  const setCachedPortfolio = (data) => {
    localStorage.setItem(
      PORTFOLIO_CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  };

  const loadPortfolio = async () => {
    const cached = getCachedPortfolio();
    if (cached) {
      setPortfolioItems(cached);
      return;
    }

    const q = query(collection(db, "portfolio"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setPortfolioItems(items);
    setCachedPortfolio(items);
  };

  /* ================= Brands ================= */
  const openAddBrandModal = () => {
    setEditingBrandId(null);
    setBrandName("");
    setIsBrandModalOpen(true);
  };

  const openEditBrandModal = (brand) => {
    setEditingBrandId(brand.id);
    setBrandName(brand.name);
    setIsBrandModalOpen(true);
  };

  const addBrand = async () => {
    if (!brandName.trim()) {
      setErrorText("Введіть назву бренду");
      setErrorModalOpen(true);
      return;
    }

    await addDoc(collection(db, "brands"), {
      name: brandName.trim(),
      createdAt: serverTimestamp(),
    });

    loadBrands();
    setIsBrandModalOpen(false);
  };

  const updateBrand = async () => {
    if (!brandName.trim()) {
      setErrorText("Введіть назву бренду");
      setErrorModalOpen(true);
      return;
    }

    await updateDoc(doc(db, "brands", editingBrandId), {
      name: brandName.trim(),
    });

    loadBrands();
    setIsBrandModalOpen(false);
  };

  const confirmDeleteBrand = async () => {
    await deleteDoc(doc(db, "brands", brandToDelete));
    loadBrands();
    setIsDeleteModalOpen(false);
  };

  /* ================= Products ================= */
  const openAddProductModal = () => {
    setEditingProductId(null);
    setProductForm({
      title: "",
      price: "",
      sku: "",
      comment: "",
      commentEn: "",
      isHit: false,
      description: "",
      descriptionEn: "",
      brand: "",
      status: "",
      imageBase64: "",
      imagePreview: null,
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      ...product,
      price: product.price ?? "",
      sku: product.sku ?? "",
      comment: product.comment ?? "",
      commentEn: product.commentEn ?? "",
      isHit: product.isHit ?? false,
      imagePreview: product.imageBase64,
    });
    setIsProductModalOpen(true);
  };

  const addProduct = async () => {
    const {
      title,
      description,
      descriptionEn,
      brand,
      status,
      imageBase64,
      price,
      sku,
      comment,
      commentEn,
      isHit,
    } = productForm;

    if (!title || !brand || !description || !descriptionEn || !status || !imageBase64) {
      setErrorText("Заповніть всі обовʼязкові поля");
      setErrorModalOpen(true);
      return;
    }

    await addDoc(collection(db, "products"), {
      title,
      description,
      descriptionEn,
      brand,
      status,
      imageBase64,
      price: price ?? "",
      sku: sku ?? "",
      comment: comment ?? "",
      commentEn: commentEn ?? "",
      isHit: isHit ?? false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    loadProducts();
    setIsProductModalOpen(false);
  };

  const updateProduct = async () => {
    const {
      title,
      description,
      descriptionEn,
      brand,
      status,
      imageBase64,
      imagePreview,
      price,
      sku,
      comment,
      commentEn,
      isHit,
    } = productForm;

    if (!title || !brand || !description || !descriptionEn || !status) {
      setErrorText("Заповніть всі обовʼязкові поля");
      setErrorModalOpen(true);
      return;
    }
console.log("editingProductId:", editingProductId);
    await updateDoc(doc(db, "products", editingProductId), {
      title,
      description,
      descriptionEn,
      brand,
      status,
      imageBase64: imagePreview || imageBase64,
      price: price ?? "",
      sku: sku ?? "",
      comment: comment ?? "",
      commentEn: commentEn ?? "",
      isHit: isHit ?? false,
      updatedAt: serverTimestamp(),
    });
console.log(brand);
    loadProducts();
    setIsProductModalOpen(false);
  };

  const confirmDeleteProduct = async () => {
    await deleteDoc(doc(db, "products", productToDelete));
    loadProducts();
    setIsDeleteProductModalOpen(false);
  };

  /* ================= Portfolio ================= */
  const openAddPortfolioModal = () => {
    setEditingPortfolioId(null);
    setPortfolioForm({
      beforeBase64: "",
      afterBase64: "",
      title: "",
      titleEn: "",
      description: "",
      descriptionEn: "",
    });
    setIsPortfolioModalOpen(true);
  };

  const openEditPortfolioModal = (item) => {
    setEditingPortfolioId(item.id);
    setPortfolioForm({
      beforeBase64: item.beforeBase64 || "",
      afterBase64: item.afterBase64 || "",
      title: item.title || "",
      titleEn: item.titleEn || "",
      description: item.description || "",
      descriptionEn: item.descriptionEn || "",
    });
    setIsPortfolioModalOpen(true);
  };

  const addPortfolio = async () => {
    const { beforeBase64, afterBase64, title, titleEn, description, descriptionEn } =
      portfolioForm;

    if (
      !beforeBase64 ||
      !afterBase64 ||
      !title ||
      !titleEn ||
      !description ||
      !descriptionEn
    ) {
      setErrorText("Заповніть всі обовʼязкові поля");
      setErrorModalOpen(true);
      return;
    }

    await addDoc(collection(db, "portfolio"), {
      beforeBase64,
      afterBase64,
      title,
      titleEn,
      description,
      descriptionEn,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    localStorage.removeItem(PORTFOLIO_CACHE_KEY);
    loadPortfolio();
    setIsPortfolioModalOpen(false);
  };

  const updatePortfolio = async () => {
    const { beforeBase64, afterBase64, title, titleEn, description, descriptionEn } =
      portfolioForm;

    if (
      !beforeBase64 ||
      !afterBase64 ||
      !title ||
      !titleEn ||
      !description ||
      !descriptionEn
    ) {
      setErrorText("Заповніть всі обовʼязкові поля");
      setErrorModalOpen(true);
      return;
    }

    await updateDoc(doc(db, "portfolio", editingPortfolioId), {
      beforeBase64,
      afterBase64,
      title,
      titleEn,
      description,
      descriptionEn,
      updatedAt: serverTimestamp(),
    });

    localStorage.removeItem(PORTFOLIO_CACHE_KEY);
    loadPortfolio();
    setIsPortfolioModalOpen(false);
  };

  const confirmDeletePortfolio = async () => {
    await deleteDoc(doc(db, "portfolio", portfolioToDelete));
    localStorage.removeItem(PORTFOLIO_CACHE_KEY);
    loadPortfolio();
    setIsDeletePortfolioModalOpen(false);
  };

  /* ================= Render ================= */
  return (
    <div className={styles.adminPanel}>
      {!user && (
        <div className={styles.loginDiv}>
          <form onSubmit={handleLogin}>
            <h1>Log in</h1>

            <label className={styles.required}>
              Email
              <input
                type="email"
                placeholder="Email"
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
                  placeholder="Password"
                  required
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                <img
                  className={styles.passwordToggle}
                  src={showPassword ? EyeOffIcon : EyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                  alt=""
                />
              </div>
            </label>

            <button type="submit">Login</button>
            {loginError && <p>{loginError}</p>}
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
            products={products}
            portfolioItems={portfolioItems}
            orders={orders}
            activeSection={activeSection}
            onAddBrand={openAddBrandModal}
            onEditBrand={openEditBrandModal}
            onDeleteBrand={(id) => {
              setBrandToDelete(id);
              setIsDeleteModalOpen(true);
            }}
            onAddProduct={openAddProductModal}
            onEditProduct={openEditProductModal}
            onDeleteProduct={(id) => {
              setProductToDelete(id);
              setIsDeleteProductModalOpen(true);
            }}
            onAddPortfolio={openAddPortfolioModal}
            onEditPortfolio={openEditPortfolioModal}
            onDeletePortfolio={(id) => {
              setPortfolioToDelete(id);
              setIsDeletePortfolioModalOpen(true);
            }}
          />

          <BrandModal
            isOpen={isBrandModalOpen}
            brandName={brandName}
            setBrandName={setBrandName}
            onSave={editingBrandId ? updateBrand : addBrand}
            onClose={() => setIsBrandModalOpen(false)}
          />

          <ProductModal
            isOpen={isProductModalOpen}
            productForm={productForm}
            setProductForm={setProductForm}
            onSave={editingProductId ? updateProduct : addProduct}
            onClose={() => setIsProductModalOpen(false)}
            brands={brands}
          />

          <PortfolioModal
            isOpen={isPortfolioModalOpen}
            portfolioForm={portfolioForm}
            setPortfolioForm={setPortfolioForm}
            onSave={editingPortfolioId ? updatePortfolio : addPortfolio}
            onClose={() => setIsPortfolioModalOpen(false)}
            isEditing={Boolean(editingPortfolioId)}
          />

          <ConfirmModal
            isOpen={isDeleteModalOpen}
            title="Видалити бренд?"
            onConfirm={confirmDeleteBrand}
            onCancel={() => setIsDeleteModalOpen(false)}
          />

          <ConfirmModal
            isOpen={isDeleteProductModalOpen}
            title="Видалити продукт?"
            onConfirm={confirmDeleteProduct}
            onCancel={() => setIsDeleteProductModalOpen(false)}
          />

          <ConfirmModal
            isOpen={isDeletePortfolioModalOpen}
            title="Видалити запис портфоліо?"
            onConfirm={confirmDeletePortfolio}
            onCancel={() => setIsDeletePortfolioModalOpen(false)}
          />

          <ErrorModal
            isOpen={errorModalOpen}
            text={errorText}
            onClose={() => setErrorModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default AdminPanel;
