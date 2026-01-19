import React from 'react';
import Brands from './AdminBrands';
import Products from './AdminProducts';
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
search}) => {

   const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  // Filter products based on search (by title or brand)
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
  );
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
     {/* {activeSection === "orders" && <Orders />} */}
    </>
  );
};

export default AdminMainContent;