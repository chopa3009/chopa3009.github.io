import React from 'react';
import Brands from './AdminBrands';
import Products from './AdminProducts';
import Portfolio from './AdminPortfolio';
import Orders from './AdminOrders';
import styles from "../css/AdminMainContent.module.css";

const AdminMainContent = ({   activeSection,
  brands,
  onAddBrand,
  onEditBrand,
  onDeleteBrand,
products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
portfolioItems,
  onAddPortfolio,
  onEditPortfolio,
  onDeletePortfolio,
orders,
search,
onUpdateOrderStatus}) => {

   const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  // Filter products based on search (by title or brand)
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredPortfolio = portfolioItems.filter(
    (item) =>
      (item.title || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (item.titleEn || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const name = `${o.customer?.firstName || ""} ${o.customer?.lastName || ""}`.toLowerCase();
    const phone = (o.customer?.phone || "").toLowerCase();
    const email = (o.customer?.email || "").toLowerCase();
    return (
      name.includes(search.toLowerCase()) ||
      phone.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    );
  });
  return (
    <>
      {activeSection === "brands" && <Brands   brands={filteredBrands}
        onAddBrand={onAddBrand}
        onEditBrand={onEditBrand}
        onDeleteBrand={onDeleteBrand}/>}
      {activeSection === "products" && <Products products={filteredProducts}
        onAddProduct={onAddProduct}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}/>}
      {activeSection === "portfolio" && (
        <Portfolio
          items={filteredPortfolio}
          onAddPortfolio={onAddPortfolio}
          onEditPortfolio={onEditPortfolio}
          onDeletePortfolio={onDeletePortfolio}
        />
      )}
      {activeSection === "orders" && (
        <Orders orders={filteredOrders} onUpdateOrderStatus={onUpdateOrderStatus} />
      )}
    </>
  );
};

export default AdminMainContent;
