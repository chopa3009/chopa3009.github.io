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
  speed = 50,
  containerHeight = 100,
  imageHeight = 50,
  gap = 80,
}) => {
  const containerRef = useRef(null);
  const [allImages, setAllImages] = useState([]);

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

  const imageStyle = (opacity) => ({
    height: `${imageHeight}px`,
    width: "auto",
    opacity,
    marginRight: `${gap}px`,
    flexShrink: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const singleWidth = images.reduce(
      (acc, img) => acc + imageHeight + gap, // приблизна ширина одного елементу
      0
    );

    const repeatCount = Math.ceil(containerWidth / singleWidth) + 2;
    setAllImages(Array.from({ length: repeatCount }).flatMap(() => images));
  }, [images, containerRef.current, gap, imageHeight]);

  // Анімація requestAnimationFrame
  useEffect(() => {
    if (!containerRef.current) return;

    const ticker = containerRef.current.querySelector("div");
    let pos = 0;
    let req;

    const totalWidth = ticker.scrollWidth / 2;

    const animate = () => {
      pos += speed / 60; // приблизно px/frame
      if (pos >= totalWidth) pos = 0;
      ticker.style.transform = `translate3d(${-pos}px,0,0)`;
      req = requestAnimationFrame(animate);
    };

    req = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(req);
  }, [allImages, speed]);

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
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", willChange: "transform" }}>
        {allImages.map((img, idx) => (
          <img key={idx} src={img.src} alt="" style={imageStyle(img.opacity)} />
        ))}
      </div>
    </div>
  );
};

export default ImageTicker;
