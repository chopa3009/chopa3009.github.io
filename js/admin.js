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

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// ===== DOM Elements =====
const loginDiv = document.getElementById("loginDiv");
const adminDiv = document.getElementById("adminDiv");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const productForm = document.getElementById("productForm");
const productsContainer = document.getElementById("productsContainer");

const titleInput = document.getElementById("title");
const descUaInput = document.getElementById("description"); // old UA description
const descEnInput = document.getElementById("descriptionEn"); // new EN description
const brandInput = document.getElementById("brand");
const imageInput = document.getElementById("image");
const editingIdInput = document.getElementById("editingId");

// ===== Auth listener =====
auth.onAuthStateChanged(user => {
  if (user) {
    loginDiv.style.display = "none";
    adminDiv.style.display = "block";
    loadProducts();
  } else {
    loginDiv.style.display = "block";
    adminDiv.style.display = "none";
  }
});

// ===== Login =====
loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await auth.signInWithEmailAndPassword(email, password);
    loginForm.reset();
  } catch (err) {
    alert(err.message);
  }
});

// ===== Logout =====
logoutBtn.addEventListener("click", () => auth.signOut());

// ===== Convert image to Base64 =====
function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

// ===== Add / Edit Product =====
productForm.addEventListener("submit", async e => {
  e.preventDefault();

  const title = titleInput.value.trim().slice(0,50);
  const descriptionUa = descUaInput.value.trim().slice(0,400);
  const descriptionEn = descEnInput.value.trim().slice(0,400);
  const brand = brandInput.value.trim().slice(0,30);
  const imageFile = imageInput.files[0];
  const editingId = editingIdInput.value;

  if (!title || !descriptionUa || !brand) 
    return alert("UA description is required");

  let imageBase64 = null;
  if (imageFile) {
    const maxSizeMB = 1;
    if (imageFile.size > maxSizeMB * 1024 * 1024) 
      return alert(`Image size should not exceed ${maxSizeMB} MB`);
    imageBase64 = await imageToBase64(imageFile);
  }

  try {
    const productData = {
      title,
      brand,
      description: descriptionUa, // old field for UA
      descriptionEn // new field for EN
    };
    if (imageBase64) productData.imageBase64 = imageBase64;

    if (editingId) {
      await db.collection("products").doc(editingId).update(productData);
      editingIdInput.value = "";
    } else {
      if (!imageBase64) return alert("Please select an image for new product");
      await db.collection("products").add({
        ...productData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    productForm.reset();
    loadProducts();
  } catch(err) {
    console.error(err);
    alert("Error saving product");
  }
});

// ===== Load Products =====
async function loadProducts() {
  productsContainer.innerHTML = "";
  const snapshot = await db.collection("products").orderBy("createdAt","desc").get();

  const grouped = {};
  snapshot.forEach(doc => {
    const product = doc.data();
    const brand = product.brand || "No Brand";
    if (!grouped[brand]) grouped[brand] = [];
    grouped[brand].push({ id: doc.id, ...product });
  });

  for (const brand in grouped) {
    const brandDiv = document.createElement("div");
    brandDiv.classList.add("brand-group");
    brandDiv.innerHTML = `<h2>${brand}</h2>`;

    const gridDiv = document.createElement("div");
    gridDiv.classList.add("products-grid");

    grouped[brand].forEach(product => {
      const div = document.createElement("div");
      div.classList.add("product");
      div.innerHTML = `
        <img src="${product.imageBase64}" alt="${product.title}">
        <h3>${product.title}</h3>
        <div class="product-descriptions">
          <p class="desc-ua"><strong>UA:</strong> ${product.description}</p>
          <p class="desc-en"><strong>EN:</strong> ${product.descriptionEn || ""}</p>
        </div>
        <button class="edit-btn" data-id="${product.id}">Edit</button>
        <button class="delete-btn" data-id="${product.id}">Delete</button>
      `;
      gridDiv.appendChild(div);

      div.querySelector(".edit-btn").addEventListener("click", () => editProduct(product.id, product));
      div.querySelector(".delete-btn").addEventListener("click", () => deleteProduct(product.id));
    });

    brandDiv.appendChild(gridDiv);
    productsContainer.appendChild(brandDiv);
  }
}

// ===== Edit Product =====
function editProduct(id, product) {
  titleInput.value = product.title;
  brandInput.value = product.brand;
  descUaInput.value = product.description;
  descEnInput.value = product.descriptionEn || "";
  editingIdInput.value = id;
  imageInput.value = "";
  window.scrollTo({top:0, behavior:"smooth"});
}

// ===== Delete Product =====
async function deleteProduct(docId) {
  if (!confirm("Are you sure you want to delete this product?")) return;
  try {
    await db.collection("products").doc(docId).delete();
    loadProducts();
  } catch (err) {
    console.error(err);
    alert("Error deleting product");
  }
}
