import React, { useRef } from "react";
import styles from "../css/PortfolioModal.module.css";
import arrow from "../assets/image_arrow.svg";

const PortfolioModal = ({
  isOpen,
  portfolioForm,
  setPortfolioForm,
  onSave,
  onClose,
  isEditing,
}) => {
  if (!isOpen) return null;

  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPortfolioForm({
        ...portfolioForm,
        [field]: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.title}>
          {isEditing ? "Редагувати портфоліо" : "Додати портфоліо"}
        </div>

        <div className={styles.imagesRow}>
          <div
            className={styles.imageBox}
            onClick={() => beforeInputRef.current?.click()}
          >
            {portfolioForm.beforeBase64 ? (
              <img
                src={portfolioForm.beforeBase64}
                alt="Before"
                className={styles.image}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span className={styles.uploadText}>Завантажити</span>
                <span className={styles.uploadText}>фото до</span>
                <img src={arrow} alt="Upload" className={styles.uploadIcon} />
              </div>
            )}
            <input
              ref={beforeInputRef}
              type="file"
              accept="image/*"
              className={styles.hiddenFileInput}
              onChange={(e) => handleImageChange(e, "beforeBase64")}
            />
          </div>

          <div
            className={styles.imageBox}
            onClick={() => afterInputRef.current?.click()}
          >
            {portfolioForm.afterBase64 ? (
              <img
                src={portfolioForm.afterBase64}
                alt="After"
                className={styles.image}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span className={styles.uploadText}>Завантажити</span>
                <span className={styles.uploadText}>фото після</span>
                <img src={arrow} alt="Upload" className={styles.uploadIcon} />
              </div>
            )}
            <input
              ref={afterInputRef}
              type="file"
              accept="image/*"
              className={styles.hiddenFileInput}
              onChange={(e) => handleImageChange(e, "afterBase64")}
            />
          </div>
        </div>

        <div className={styles.titleRow}>
          <input
            className={styles.inputWide}
            placeholder="*Тайтл українською"
            value={portfolioForm.title}
            onChange={(e) =>
              setPortfolioForm({ ...portfolioForm, title: e.target.value })
            }
          />
          <input
            className={styles.inputWide}
            placeholder="*Тайтл англійською"
            value={portfolioForm.titleEn}
            onChange={(e) =>
              setPortfolioForm({ ...portfolioForm, titleEn: e.target.value })
            }
          />
        </div>

        <div className={styles.descriptionRow}>
          <textarea
            className={styles.description}
            placeholder="*Опис українською"
            value={portfolioForm.description}
            onChange={(e) =>
              setPortfolioForm({ ...portfolioForm, description: e.target.value })
            }
          />
          <textarea
            className={styles.description}
            placeholder="*Опис англійською"
            value={portfolioForm.descriptionEn}
            onChange={(e) =>
              setPortfolioForm({
                ...portfolioForm,
                descriptionEn: e.target.value,
              })
            }
          />
        </div>

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

export default PortfolioModal;
