const DB_NAME = "bove-cache-db";
const DB_VERSION = 1;
const STORE_NAME = "app-cache";
const SHOP_PRODUCTS_KEY = "shop_products_cache";
export const SHOP_PRODUCTS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

const canUseIndexedDb = () =>
  typeof window !== "undefined" && "indexedDB" in window;

const openCacheDb = () =>
  new Promise((resolve, reject) => {
    if (!canUseIndexedDb()) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const runRequest = (request) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const getCacheRecord = async (key) => {
  const db = await openCacheDb();
  if (!db) return null;

  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  return runRequest(store.get(key));
};

const setCacheRecord = async (key, data) => {
  const db = await openCacheDb();
  if (!db) return;

  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  await runRequest(
    store.put({
      key,
      data,
      timestamp: Date.now(),
    })
  );
};

const deleteCacheRecord = async (key) => {
  const db = await openCacheDb();
  if (!db) return;

  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  await runRequest(store.delete(key));
};

export const getShopProductsCache = async () => {
  try {
    const record = await getCacheRecord(SHOP_PRODUCTS_KEY);
    if (!record) return null;

    if (Date.now() - record.timestamp > SHOP_PRODUCTS_CACHE_TTL) {
      await deleteCacheRecord(SHOP_PRODUCTS_KEY);
      return null;
    }

    return record.data || null;
  } catch {
    return null;
  }
};

export const setShopProductsCache = async (data) => {
  try {
    await setCacheRecord(SHOP_PRODUCTS_KEY, data);
  } catch (error) {
    console.error("Error saving shop cache:", error);
  }
};

export const clearShopProductsCache = async () => {
  try {
    await deleteCacheRecord(SHOP_PRODUCTS_KEY);
  } catch (error) {
    console.error("Error clearing shop cache:", error);
  }
};
