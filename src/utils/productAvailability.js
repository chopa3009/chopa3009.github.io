export const PRODUCT_STATUS = {
  IN_STOCK: "В наявності",
  PRE_ORDER: "Під замовлення",
  OUT_OF_STOCK: "Не в наявності",
};

export const isInStock = (status) =>
  status === PRODUCT_STATUS.IN_STOCK || status === "In stock";

export const isPreOrder = (status) =>
  status === PRODUCT_STATUS.PRE_ORDER || status === "Pre-order";

export const isOutOfStock = (status) =>
  status === PRODUCT_STATUS.OUT_OF_STOCK || status === "Out of stock";

// Products created before statuses were introduced remain visible.
export const isVisibleInShop = (product) => !isOutOfStock(product?.status);

export const hasContractPrice = (product) =>
  isPreOrder(product?.status) || !product?.price;

export const getEffectiveProductPrice = (product) =>
  hasContractPrice(product) ? null : product.price;
