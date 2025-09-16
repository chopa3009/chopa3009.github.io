// ===== Firebase config =====
const firebaseConfig = {
  apiKey: "AIzaSyD2rkpPXqqwYQ4JctT8Gu6E6mIytoJqPGo",
  authDomain: "bove-948cf.firebaseapp.com",
  projectId: "bove-948cf",
  storageBucket: "bove-948cf.firebasestorage.app",
  messagingSenderId: "36414468939",
  appId: "1:36414468939:web:2907567ba0986373482ece",
  measurementId: "G-QH31QNJXWF"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===== DOM Elements =====
const productsContainer = document.getElementById("productsContainer");
const brandsContainer = document.getElementById("brandsContainer");

let allProducts = [];
let allBrands = [];

// ===== Load Products =====
async function loadProducts() {
  productsContainer.innerHTML = "";
  const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
  allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Get unique brands
  const lang = document.documentElement.lang || "ua";
  const brandSet = new Set(allProducts.map(p => p.brand));
  allBrands = [
    lang === "en" ? "All products" : "Всі продукти",
    ...Array.from(brandSet)
  ];

  renderBrands();
  displayProducts(allProducts);
}

// ===== Display Products =====
function displayProducts(products) {
  const lang = document.documentElement.lang || "ua";
  productsContainer.innerHTML = "";

  if (products.length === 0) {
    productsContainer.innerHTML = `<p class="no-products">${lang === "en" ? "No products." : "Немає продуктів."}</p>`;
    return;
  }

  products.forEach(product => {
    const div = document.createElement("div");
    div.classList.add("product");

    // Choose description based on language
    const description = lang === "en" ? product.descriptionEn || product.description : product.description;

    div.innerHTML = `
      <img src="${product.imageBase64}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>${description}</p>
    `;

    productsContainer.appendChild(div);
  });
}

// ===== Render Brands =====
function renderBrands() {
  const lang = document.documentElement.lang || "ua";
  brandsContainer.innerHTML = "";

  allBrands.forEach(brand => {
    const div = document.createElement("div");
    div.classList.add("_-restorations");

    const span = document.createElement("div");
    span.classList.add("text-regular");
    span.textContent = brand;

    span.addEventListener("click", () => {
      // Highlight active brand
      document.querySelectorAll("#brandsContainer .text-regular").forEach(b => b.classList.remove("active-brand"));
      span.classList.add("active-brand");

      if (brand.toLowerCase() === "всі продукти" || brand.toLowerCase() === "all products") {
        displayProducts(allProducts);
      } else {
        const filtered = allProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
        displayProducts(filtered);
      }

      // Scroll to products section on desktop
      if (window.innerWidth >= 768) {
        document.getElementById("products-section").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    div.appendChild(span);
    brandsContainer.appendChild(div);
  });
}

// ===== Initialize =====
loadProducts();
