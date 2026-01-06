// Ticker.jsx
import React, { useRef, useEffect, useMemo, useState } from "react";
import styles from "../css/Ticker.module.css";

import img1 from "../assets/Dyson.png";
import img2 from "../assets/Brae.png";
import img3 from "../assets/Tangle_Teezer.png";
import img4 from "../assets/Dr.Sorbie.png";
import img5 from "../assets/JRL.png";
import img6 from "../assets/Keune.png";
import img7 from "../assets/Medavita.png";

const ImageTicker = ({ speed = 50 }) => {
  const containerRef = useRef(null);
  const tickerRef = useRef(null);

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

  const [settings, setSettings] = useState({ imageHeight: 50, gap: 80, containerHeight: 100 });
  const [allImages, setAllImages] = useState([]);

  // Responsive settings
  useEffect(() => {
    const updateSettings = () => {
      if (window.innerWidth <= 768) {
        setSettings({ imageHeight: 30, gap: 50, containerHeight: 80 });
      } else if (window.innerWidth <= 1439) {
        setSettings({ imageHeight: 30, gap: 50, containerHeight: 80 });
      } else {
        setSettings({ imageHeight: 50, gap: 80, containerHeight: 100 });
      }
    };
    updateSettings();
    window.addEventListener("resize", updateSettings);
    return () => window.removeEventListener("resize", updateSettings);
  }, []);

  const imageStyle = (opacity) => ({
    height: `${settings.imageHeight}px`,
    width: "auto",
    opacity,
    marginRight: `${settings.gap}px`,
    flexShrink: 0,
    display: "inline-block",
  });

  // Prepare images for smooth loop
  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;

    // Estimate width of one sequence
    const singleWidth = images.reduce((acc, _) => acc + settings.imageHeight + settings.gap, 0);
    const repeatCount = Math.ceil(containerWidth / singleWidth) + 4;

    const repeated = Array.from({ length: repeatCount }).flatMap(() => images);
    setAllImages([...repeated, ...repeated]); // two blocks for seamless loop
  }, [images, settings.imageHeight, settings.gap]);

  // Smooth animation using translateX + reset when first block fully scrolled
  useEffect(() => {
    if (!tickerRef.current) return;
    const ticker = tickerRef.current;

    let pos = 0;
    let blockWidth = 0;
    let lastTimestamp = performance.now();

    const updateBlockWidth = () => {
      // half of the ticker content is one "block"
      blockWidth = ticker.scrollWidth / 2;
    };
    updateBlockWidth();
    window.addEventListener("resize", updateBlockWidth);

    const animate = (timestamp) => {
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      pos += (speed * delta) / 1000;

      if (pos >= blockWidth) pos -= blockWidth; // reset without jump

      ticker.style.transform = `translate3d(${-pos}px,0,0)`;
      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateBlockWidth);
    };
  }, [allImages, speed]);

  return (
    <div
      ref={containerRef}
      className={styles.tickerWrapper}
      style={{
        height: `${settings.containerHeight}px`,
        overflow: "hidden",
        width: "100%",
        display: "flex",
        alignItems: "center",
        background: "#f6ecdd",
      }}
    >
      <div
        ref={tickerRef}
        style={{
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          willChange: "transform",
        }}
      >
        {allImages.map((img, idx) => (
          <img key={idx} src={img.src} alt="" style={imageStyle(img.opacity)} />
        ))}
      </div>
    </div>
  );
};

export default ImageTicker;
