import React, { useRef, useEffect, useState } from "react";
import styles from "../css/Ticker.module.css";

import img1 from "../assets/Dyson.png";
import img2 from "../assets/Brae.png";
import img3 from "../assets/Tangle_Teezer.png";
import img4 from "../assets/Dr.Sorbie.png";

const ImageTicker = ({ speed = 20, containerHeight = 100, gap = 70 }) => {
  const containerRef = useRef(null);
  const firstCopyRef = useRef(null);
  const [allImages, setAllImages] = useState([]);
  const [animationWidth, setAnimationWidth] = useState(0);

  const images = [img1, img2, img3, img4];

  useEffect(() => {
    const setupTicker = () => {
      if (!containerRef.current || !firstCopyRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const firstCopyWidth = firstCopyRef.current.scrollWidth;

      // Кількість повторів, щоб перекрити контейнер + 1 копія для безшовності
      const repeatCount = Math.ceil(containerWidth / firstCopyWidth) + 2;

      setAllImages(Array.from({ length: repeatCount }).flatMap(() => images));
      setAnimationWidth(firstCopyWidth);
    };

    // Виконуємо після першого рендеру
    const raf = requestAnimationFrame(setupTicker);
    window.addEventListener("resize", setupTicker);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setupTicker);
    };
  }, [images, gap]);

  return (
    <div
      ref={containerRef}
      className={styles.tickerWrapper}
      style={{
        height: `${containerHeight}px`,
        overflow: "hidden",
        width: "100%",
        background: "#f6ecdd",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Перша копія для виміру */}
      <div
        ref={firstCopyRef}
        style={{
          display: "flex",
          position: "absolute",
          visibility: "hidden",
        }}
      >
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`ticker-${idx}`}
            style={{ marginRight: `${gap}px`, flexShrink: 0 }}
          />
        ))}
      </div>

      {/* Основна анімація */}
      <div
        className={styles.tickerContent}
        style={{
          display: "flex",
          alignItems: "center",
          animation: animationWidth ? `scrollLeft ${speed}s linear infinite` : "none",
        }}
      >
        {allImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`ticker-${idx}`}
            style={{ marginRight: `${gap}px`, flexShrink: 0 }}
          />
        ))}
      </div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${animationWidth}px); }
        }
      `}</style>
    </div>
  );
};

export default ImageTicker;
