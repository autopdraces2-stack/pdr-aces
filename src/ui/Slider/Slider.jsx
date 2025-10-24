"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./Slider.module.css";
import Image from "next/image";

export default function ImageCompareSlider({
  before,
  after,
  altBefore = "Before image",
  altAfter = "After image",
}) {
  const wrapperRef = useRef(null);
  const afterRef = useRef(null);
  const sliderRef = useRef(null);
  const isDraggingRef = useRef(false);
  const positionRef = useRef(50);
  const [_, forceRender] = useState(0);

  const updatePosition = (clientX) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const bounds = wrapper.getBoundingClientRect();
    let x = clientX - bounds.left;
    x = Math.max(0, Math.min(x, bounds.width));
    const percent = (x / bounds.width) * 100;
    positionRef.current = percent;
    requestAnimationFrame(() => {
      if (afterRef.current && sliderRef.current) {
        afterRef.current.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        sliderRef.current.style.left = `${percent}%`;
      }
    });
  };

  const handleDown = (e) => {
    isDraggingRef.current = true;
    updatePosition(e.clientX ?? e.touches[0].clientX);
  };

  const handleMove = (e) => {
    if (!isDraggingRef.current) return;
    updatePosition(e.clientX ?? e.touches[0].clientX);
  };

  const handleUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={styles.imageWrapper}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
    >
      <Image
        width={800}
        height={800}
        src={before}
        alt={altBefore}
        className={styles.beforeImage}
        draggable={false}
      />
      <div
        ref={afterRef}
        className={styles.afterWrapper}
        style={{ clipPath: `inset(0 50% 0 0)` }}
      >
        <Image
          width={800}
          height={800}
          src={after}
          alt={altAfter}
          className={styles.afterImage}
          draggable={false}
        />
      </div>
      <div ref={sliderRef} className={styles.slider} style={{ left: "50%" }}>
        <div className={styles.handle} />
      </div>
    </div>
  );
}
