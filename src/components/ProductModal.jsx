import React, { useRef } from "react";
import styles from "../css/ProductModal.module.css";
import arrow from "../assets/image_arrow.svg";

const ProductModal = ({
  isOpen,
  productForm,
  setProductForm,
  onSave,
  onClose,
  isEditing,
  brands,
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProductForm({
        ...productForm,
        imageBase64: reader.result, // ← одразу в правильне поле
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>

        {/* TOP */}
        <div className={styles.topSection}>
          {/* IMAGE */}
          <div className={styles.imageBox} onClick={handleImageClick}>
            {productForm.imageBase64 ? (
              <img
                src={productForm.imageBase64}
                alt="Preview"
                className={styles.image}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span className={styles.uploadText}>Завантажити</span>
                <span className={styles.uploadText}>фото</span>
                <img
    src={arrow} // твій SVG імпортованого файлу
    alt="Upload"
    className={styles.uploadIcon}
  />
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.hiddenFileInput}
              onChange={handleImageChange}
            />
          </div>

          {/* RIGHT FORM */}
          <div className={styles.rightForm}>
            <div className={styles.rowSmall}>
              <select
              required
                className={styles.inputSmall}
                value={productForm.brand}
                onChange={(e) =>
                  setProductForm({ ...productForm, brand: e.target.value })
                }
              >
                <option value="" disabled hidden>*Бренд</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>

              <select 
              required
                className={styles.inputSmall}
                value={productForm.status || ""}
                onChange={(e) =>
                  setProductForm({ ...productForm, status: e.target.value })
                }
              >
                <option value="" disabled hidden>*Статус</option>
                <option value="В наявності">В наявності</option>
                <option value="Під замовлення">Під замовлення</option>
              </select>
            </div>

            <input
              className={styles.inputWide}
              placeholder="*Назва продукту"
              value={productForm.title}
              onChange={(e) =>
                setProductForm({ ...productForm, title: e.target.value })
              }
            />

            <div className={styles.rowSmall}>
              <input
                className={styles.inputSmall}
                placeholder="Ціна"
                value={productForm.price || ""}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
              />
              <input
                className={styles.inputSmall}
                placeholder="Артикул"
                value={productForm.sku || ""}
                onChange={(e) =>
                  setProductForm({ ...productForm, sku: e.target.value })
                }
              />
            </div>

            <input
              className={styles.inputWide}
              placeholder="Коментар"
              value={productForm.comment || ""}
              onChange={(e) =>
                setProductForm({ ...productForm, comment: e.target.value })
              }
            />
          </div>
        </div>

        {/* DESCRIPTIONS */}
        <div className={styles.descriptionRow}>
          <textarea
            className={styles.description}
            placeholder="*Опис українською"
            value={productForm.description}
            onChange={(e) =>
              setProductForm({ ...productForm, description: e.target.value })
            }
          />
          <textarea
            className={styles.description}
            placeholder="*Опис англійською"
            value={productForm.descriptionEn}
            onChange={(e) =>
              setProductForm({ ...productForm, descriptionEn: e.target.value })
            }
          />
        </div>

        {/* BUTTONS */}
        <div className={styles.buttonGroup}>
          <button className={styles.cancel} onClick={onClose}>
            Скасувати
          </button>
          <button className={styles.save} onClick={onSave}>
            {isEditing ? "Зберегти" : "Додати"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
