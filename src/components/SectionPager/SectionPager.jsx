"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Section-by-section pager (v2)
 * - Full input lock during animation (wheel/touch/keys).
 * - Debounced direction (tiny deltas from trackpad won't jitter).
 * - Always goes to NEXT/PREV section based on last direction.
 * - Current section detection by viewport middle (robust with headers).
 * - Optional: data-reveal=".selector" limits reveal targets within section.
 */
export default function SectionPager({
  children,
  headerSelector = "header",
  delayMs = 140, // how long we wait after the last input burst
  duration = 0.8, // reveal duration
  scrollDur = 0.7, // scroll tween duration
  revealY = 48, // start offset for reveal
  velocityThreshold = 2, // suppress micro scrolls (trackpads)
  cooldownMs = 120, // small cool-down after animation complete
}) {
  const sectionsRef = useRef([]);
  const headerHRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const inCooldownRef = useRef(false);
  const debounceRef = useRef(null);
  const lastDeltaRef = useRef(0);
  const touchStartYRef = useRef(null);

  useEffect(() => {
    const header = document.querySelector(headerSelector);
    headerHRef.current = header ? header.getBoundingClientRect().height : 0;

    // Collect only your slide sections; safest is: section[id]
    sectionsRef.current = Array.from(document.querySelectorAll("section[id]"));

    if (!sectionsRef.current.length) return;

    // Initial hide
    sectionsRef.current.forEach((sec) => {
      const targets = getRevealTargets(sec);
      gsap.set(targets.length ? targets : sec, { opacity: 0, y: revealY });
      sec.classList.remove("is-active");
    });

    // Reveal the section that's at/near the viewport middle initially
    const currentIdx = getIndexByViewportMiddle();
    if (currentIdx >= 0) {
      setActiveOnly(sectionsRef.current[currentIdx]);
      gsap.to(
        getRevealTargets(sectionsRef.current[currentIdx])?.length
          ? getRevealTargets(sectionsRef.current[currentIdx])
          : sectionsRef.current[currentIdx],
        { opacity: 1, y: 0, duration: 0.001, ease: "none" }
      );
      hardSnapToIndex(currentIdx, { animate: false });
    }

    // Handlers
    const onWheel = (e) => {
      if (isAnimatingRef.current || inCooldownRef.current) {
        e.preventDefault?.();
        return;
      }
      const d = e.deltaY;
      // ignore micro-jitters
      if (Math.abs(d) < velocityThreshold) return;

      lastDeltaRef.current = d;
      schedule();
    };

    const onTouchStart = (e) => {
      touchStartYRef.current = e.touches?.[0]?.clientY ?? null;
    };

    const onTouchMove = (e) => {
      if (isAnimatingRef.current || inCooldownRef.current) {
        e.preventDefault?.();
        return;
      }
      if (touchStartYRef.current == null) return;
      const y = e.touches?.[0]?.clientY ?? 0;
      const d = touchStartYRef.current - y; // >0 means swipe up (next)
      if (Math.abs(d) < velocityThreshold) return;

      lastDeltaRef.current = d;
      schedule();
    };

    const onKeyDown = (e) => {
      if (isAnimatingRef.current || inCooldownRef.current) {
        e.preventDefault?.();
        return;
      }
      // Only intercept keys that imply vertical paging
      const keys = ["ArrowDown", "PageDown", "ArrowUp", "PageUp", "Space"];
      if (!keys.includes(e.code)) return;
      e.preventDefault();

      lastDeltaRef.current =
        e.code === "ArrowUp" || e.code === "PageUp" ? -100 : 100;
      schedule();
    };

    const onResize = () => {
      headerHRef.current = header ? header.getBoundingClientRect().height : 0;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schedule = () => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      goByDirection(lastDeltaRef.current);
    }, delayMs);
  };

  const getRevealTargets = (section) => {
    const selector = section.getAttribute("data-reveal");
    if (!selector) return [];
    try {
      return Array.from(section.querySelectorAll(selector));
    } catch {
      return [];
    }
  };

  // Robust current index: uses viewport middle + header offset
  const getIndexByViewportMiddle = () => {
    const middleY =
      window.scrollY + headerHRef.current + window.innerHeight * 0.5;
    let bestIdx = -1;
    let bestDist = Infinity;
    sectionsRef.current.forEach((s, i) => {
      const mid = s.offsetTop + s.offsetHeight / 2;
      const dist = Math.abs(mid - middleY);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    });
    return bestIdx;
  };

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const goByDirection = (delta) => {
    if (isAnimatingRef.current || inCooldownRef.current) return;

    const current = getIndexByViewportMiddle();
    if (current < 0) return;

    const goingDown = delta > 0;
    const targetIdx = clamp(
      current + (goingDown ? 1 : -1),
      0,
      sectionsRef.current.length - 1
    );
    if (targetIdx === current) return;

    goToIndex(targetIdx);
  };

  const hardSnapToIndex = (idx, { animate = true } = {}) => {
    const targetSection = sectionsRef.current[idx];
    const y = Math.round(targetSection.offsetTop - headerHRef.current);
    if (!animate) {
      window.scrollTo(0, y);
      return;
    }
    gsap.to(window, { duration: 0.01, scrollTo: { y, autoKill: false } });
  };

  const goToIndex = (idx) => {
    isAnimatingRef.current = true;
    inputLock(true);

    const targetSection = sectionsRef.current[idx];
    const y = Math.round(targetSection.offsetTop - headerHRef.current);

    // Reset reveal state for target
    const targets = getRevealTargets(targetSection);
    gsap.set(targets.length ? targets : targetSection, {
      opacity: 0,
      y: revealY,
    });

    // Mark only this section active (for color/theme swap)
    setActiveOnly(targetSection);

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        inputLock(false);
        inCooldownRef.current = true;
        setTimeout(() => (inCooldownRef.current = false), cooldownMs);
      },
    });

    // Prevent native rubber-band visuals on iOS during tween by clamping target
    tl.to(
      window,
      { duration: 0.7, ease: "power2.inOut", scrollTo: { y, autoKill: true } },
      0
    ).to(
      targets.length ? targets : targetSection,
      { duration, opacity: 1, y: 0, ease: "power2.out" },
      0.08 // slight overlap
    );
  };

  const inputLock = (lock) => {
    const opts = { passive: false, capture: true };
    if (lock) {
      document.addEventListener("wheel", block, opts);
      document.addEventListener("touchmove", block, opts);
      document.addEventListener("keydown", block, opts);
    } else {
      document.removeEventListener("wheel", block, { capture: true });
      document.removeEventListener("touchmove", block, { capture: true });
      document.removeEventListener("keydown", block, { capture: true });
    }
  };

  const block = (e) => {
    e.preventDefault?.();
    e.stopPropagation?.();
  };

  const setActiveOnly = (activeSection) => {
    sectionsRef.current.forEach((s) => {
      if (s === activeSection) s.classList.add("is-active");
      else s.classList.remove("is-active");
    });
  };

  return children;
}
