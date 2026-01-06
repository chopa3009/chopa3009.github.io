import React, { useRef, useEffect, useState, useMemo } from "react";
import styles from "../css/Ticker.module.css";

import img1 from "../assets/Dyson.png";
import img2 from "../assets/Brae.png";
import img3 from "../assets/Tangle_Teezer.png";
import img4 from "../assets/Dr.Sorbie.png";
import img5 from "../assets/JRL.png";
import img6 from "../assets/Keune.png";
import img7 from "../assets/Medavita.png";

const ImageTicker = ({
  speed = 20,
  containerHeight = 100,
  imageHeight = 50,
  gap = 80,
}) => {
  const containerRef = useRef(null);
  const firstCopyRef = useRef(null);

  const [allImages, setAllImages] = useState([]);
  const [animationWidth, setAnimationWidth] = useState(0);

  // 🔹 Responsive settings
  const [settings, setSettings] = useState({
    speed,
    containerHeight,
    imageHeight,
    gap,
  });

  // ✅ Images array memoized, щоб useEffect не зациклювався
  const images = useMemo(
    () => [
      { src: img1, opacity: 0.8 },
      { src: img2, opacity: 0.8 },
      { src: img3, opacity: 0.9 },
      { src: img4, opacity: 0.8 },
      { src: img5, opacity: 0.7 },
      { src: img6, opacity: 0.9 },
      { src: img7, opacity: 0.8 },
    ],
    []
  );

  // ✅ Responsive logic
  useEffect(() => {
    const updateSettings = () => {
      if (window.innerWidth <= 1439) {
        setSettings({
          speed: 20,
          containerHeight: 80,
          imageHeight: 30,
          gap: 50,
        });
      } else {
        setSettings({ speed, containerHeight, imageHeight, gap });
      }
    };

    updateSettings();
    window.addEventListener("resize", updateSettings);
    return () => window.removeEventListener("resize", updateSettings);
  }, [speed, containerHeight, imageHeight, gap]);

  // ✅ Setup ticker
  useEffect(() => {
    const setupTicker = () => {
      if (!containerRef.current || !firstCopyRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const firstCopyWidth = firstCopyRef.current.scrollWidth;

      const repeatCount = Math.ceil(containerWidth / firstCopyWidth) + 2;

      setAllImages(Array.from({ length: repeatCount }).flatMap(() => images));
      setAnimationWidth(firstCopyWidth);
    };

    setupTicker(); // викликаємо одразу після рендеру
    window.addEventListener("resize", setupTicker);

    return () => window.removeEventListener("resize", setupTicker);
  }, [images, settings.gap, settings.imageHeight]);

  const imageStyle = (opacity) => ({
    height: `${settings.imageHeight}px`,
    width: "auto",
    opacity,
    marginRight: `${settings.gap}px`,
    flexShrink: 0,
    transition: "opacity 0.3s ease",
  });

  return (
    <div
      ref={containerRef}
      className={styles.tickerWrapper}
      style={{
        height: `${settings.containerHeight}px`,
        overflow: "hidden",
        width: "100%",
        background: "#f6ecdd",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Hidden copy for width measurement */}
      <div
        ref={firstCopyRef}
        style={{
          display: "flex",
          position: "absolute",
          visibility: "hidden",
        }}
      >
        {images.map((img, idx) => (
          <img key={idx} src={img.src} alt="" style={imageStyle(img.opacity)} />
        ))}
      </div>

      {/* Animated ticker */}
      <div
        className={styles.tickerContent}
        style={{
          display: "flex",
          alignItems: "center",
          animation: animationWidth
            ? `scrollLeft ${settings.speed}s linear infinite`
            : "none",
        }}
      >
        {allImages.map((img, idx) => (
          <img key={idx} src={img.src} alt="" style={imageStyle(img.opacity)} />
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
