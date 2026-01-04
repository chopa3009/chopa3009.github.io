import React from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import InstagramIcon from "../assets/Instagram Outline.svg?react";
import WhatsAppIcon from "../assets/whatsapp-outline.svg?react";
import TelegramIcon from "../assets/Telegram Outline.svg?react";
import ViberIcon from "../assets/Viber Outline.svg?react";
import CloseIcon from "../assets/Close.svg?react";

import "../css/ModalPopup.css";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, y: -30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const ModalPopup = ({ isOpen, onClose, location }) => {
  const { t } = useTranslation();

  const modalTitle =
    location?.pathname === "/shop"
      ? t("shopModalTitle")
      : t("phoneBooking");

  const closeOnOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={closeOnOverlay}
        >
          <motion.div
            className="modal-container"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={onClose}
              aria-label="Close modal"
            >
              <CloseIcon width={36} height={36} />
            </button>

            <div className="modal-content">
              <h2 className="modal-title">{modalTitle}</h2>

              <a href="tel:+380961744378">
                <div className="modal-phone">+380 96 174 43 78</div>
              </a>

              <div className="social-icons">
                <a
                  href="https://instagram.com/_valentina_bodnaruk_"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="social-icon" />
                </a>

                <a
                  href="https://wa.me/380961744378"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon className="social-icon" />
                </a>

                <a
                  href="https://t.me/+380961744378"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Telegram"
                >
                  <TelegramIcon className="social-icon" />
                </a>

                <a
                  href="viber://chat?number=%2B380961744378"
                  aria-label="Viber"
                >
                  <ViberIcon className="social-icon" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalPopup;
