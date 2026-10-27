"use client";

import { useEffect, useRef } from "react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { BeforeAfter } from "@/components/site/BeforeAfter";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

function setPos(ba, pct) {
  ba.style.setProperty("--pos", `${Math.min(100, Math.max(0, pct))}%`);
}

function fromPointer(ba, event) {
  const rect = ba.getBoundingClientRect();
  if (!rect.width) return;
  setPos(ba, ((event.clientX - rect.left) / rect.width) * 100);
}

function isActiveSlide(ba) {
  return ba.closest(".swiper-slide")?.classList.contains("swiper-slide-active");
}

// Slides past the two neighbours are turned edge-on. Hide them so the back
// face does not show, and keep every z-index positive so a card cannot slip
// behind the carousel.
function syncSlides(swiper) {
  swiper.updateSlidesProgress(swiper.translate);
  swiper.slides.forEach((slide) => {
    const distance = Math.abs(slide.progress || 0);
    const hidden = distance > 2.4;
    slide.style.opacity = hidden ? "0" : "1";
    slide.style.pointerEvents = hidden ? "none" : "";
    slide.style.zIndex = String(Math.max(1, 8 - Math.round(distance)));
  });
}

export function WorkCarousel({ pairs }) {
  const rootRef = useRef(null);
  const swiperRef = useRef(null);
  const count = pairs.length;
  // Three copies keep two real cards on both sides of the active one.
  // Swiper's own loop leaves the active card at the end of a five-card row,
  // so the far card on the right is missing until the row is reordered.
  const slides = [0, 1, 2].flatMap((copy) =>
    pairs.map((pair, index) => ({ ...pair, key: `${copy}-${index}` }))
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let dragging = null;

    const onKeyDown = (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const knob = event.target.closest?.(".ba__knob");
      if (knob) {
        const ba = knob.closest(".ba");
        if (!ba || !isActiveSlide(ba)) return;
        event.preventDefault();
        event.stopPropagation();
        const now = parseFloat(getComputedStyle(ba).getPropertyValue("--pos")) || 50;
        setPos(ba, now + (event.key === "ArrowLeft" ? -5 : 5));
        return;
      }

      const frame = root.querySelector(".swiper");
      if (event.target !== frame) return;
      event.preventDefault();
      const swiper = swiperRef.current;
      if (!swiper) return;
      if (event.key === "ArrowLeft") swiper.slidePrev();
      else swiper.slideNext();
    };

    const onPointerDown = (event) => {
      const line = event.target.closest?.(".ba__line");
      if (!line || !root.contains(line)) return;
      const ba = line.closest(".ba");
      if (!ba || !isActiveSlide(ba)) return;
      event.stopPropagation();
      event.preventDefault();
      if (swiperRef.current) swiperRef.current.allowTouchMove = false;
      dragging = { id: event.pointerId, ba };
      line.setPointerCapture?.(event.pointerId);
      fromPointer(ba, event);
    };

    const onPointerMove = (event) => {
      if (!dragging || dragging.id !== event.pointerId) return;
      fromPointer(dragging.ba, event);
    };

    const stopDrag = (event) => {
      if (!dragging || dragging.id !== event.pointerId) return;
      dragging = null;
      if (swiperRef.current) swiperRef.current.allowTouchMove = true;
    };

    root.addEventListener("keydown", onKeyDown);
    root.addEventListener("pointerdown", onPointerDown, true);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", stopDrag);
    root.addEventListener("pointercancel", stopDrag);

    return () => {
      root.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("pointerdown", onPointerDown, true);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", stopDrag);
      root.removeEventListener("pointercancel", stopDrag);
    };
  }, []);

  return (
    <div
      className="cf"
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="My work photos"
    >
      <Swiper
        modules={[EffectCoverflow, Navigation]}
        className="cf__frame"
        effect="coverflow"
        centeredSlides
        slidesPerView="auto"
        initialSlide={count}
        grabCursor
        slideToClickedSlide
        watchSlidesProgress
        speed={450}
        tabIndex={0}
        noSwiping
        noSwipingSelector=".ba__line, .ba__knob"
        coverflowEffect={{
          rotate: 44,
          stretch: 0,
          depth: 160,
          modifier: 1,
          slideShadows: false,
          scale: 1,
        }}
        navigation={{
          prevEl: ".cf__nav--prev",
          nextEl: ".cf__nav--next",
          addIcons: false,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          swiper.on("setTranslate", () => syncSlides(swiper));
          swiper.on("transitionEnd", () => {
            const index = swiper.activeIndex;
            if (index >= count && index < count * 2) return;
            const normalized = ((index % count) + count) % count;
            swiper.slideTo(count + normalized, 0, false);
          });
          syncSlides(swiper);
        }}
      >
        {slides.map((pair) => (
          <SwiperSlide
            key={pair.key}
            role="group"
            aria-roledescription="slide"
            aria-label={pair.label}
          >
            <BeforeAfter
              after={pair.after}
              before={pair.before}
              afterAlt={pair.afterAlt}
              beforeAlt={pair.beforeAlt}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="cf__nav cf__nav--prev" type="button" aria-label="Previous photo">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button className="cf__nav cf__nav--next" type="button" aria-label="Next photo">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
