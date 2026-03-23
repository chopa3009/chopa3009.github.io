const CART_KEY = "shop_cart";

export const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated")); // 🔥 для реакту
};

export const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price || null,
      image: product.imageBase64,
      comment: product.comment || "",
      commentEn: product.commentEn || "",
      qty: 1,
    });
  }

  saveCart(cart);
};

export const setCartItemQty = (id, qty) => {
  const cart = getCart();
  const item = cart.find((p) => p.id === id);
  if (!item) return;
  item.qty = Math.max(1, qty);
  saveCart(cart);
};

export const updateCartItemQty = (id, delta) => {
  const cart = getCart();
  const item = cart.find((p) => p.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
};

export const removeFromCart = (id) => {
  const cart = getCart().filter((p) => p.id !== id);
  saveCart(cart);
};

export const clearCart = () => {
  saveCart([]);
};

export const getCartCount = () => {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
};
