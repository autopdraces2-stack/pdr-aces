"use client";

import { useRef, Fragment, useMemo, useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Text.module.css";

/* ===== Optional GSAP is only touched by Desktop variant ===== */
let gsap, ScrollTrigger, useGSAP;
try {
  // These imports will exist in your app; safe-guard to avoid failing in non-desktop branches pre-mount
  ({ default: gsap } = require("gsap"));
  ({ ScrollTrigger } = require("gsap/ScrollTrigger"));
  ({ useGSAP } = require("@gsap/react"));
  gsap.registerPlugin(ScrollTrigger);
} catch {}

/* =========================
   Shared Base (no GSAP)
   ========================= */
export function TextBase({
  as = "p",
  variant,
  weight,
  align = "left",
  color = "primary",
  className = "",
  // splitMode: false | 'letters' | 'words' | 'opacity'
  splitMode = false,
  children,
  ...props
}) {
  const Component = as;
  const appliedVariant = variant || as;

  const isString = typeof children === "string";
  const shouldSplit = !!splitMode && isString && splitMode !== "opacity";

  const tokens = useMemo(() => {
    if (!shouldSplit) return children;

    if (splitMode === "words") {
      return children.split(/(\s+)/).map((tok, i) =>
        tok.trim() === "" ? (
          <Fragment key={`s-${i}`}>{tok}</Fragment>
        ) : (
          <span key={`w-${i}`} data-word className={styles.word}>
            {tok}
          </span>
        )
      );
    }

    // letters
    return children.split(/(\s+)/).map((tok, i) =>
      tok.trim() === "" ? (
        <Fragment key={`s-${i}`}>{tok}</Fragment>
      ) : (
        <span key={`w-${i}`} data-word className={styles.word}>
          {tok.split("").map((ch, j) => (
            <span key={`c-${i}-${j}`} data-char className={styles.char}>
              {ch}
            </span>
          ))}
        </span>
      )
    );
  }, [children, shouldSplit, splitMode]);

  const textClass = clsx(
    styles.text,
    styles[appliedVariant],
    weight && styles[`weight-${weight}`],
    styles[`align-${align}`],
    styles[`color-${color}`],
    className
  );

  return (
    <Component className={textClass} {...props}>
      {tokens}
    </Component>
  );
}

/* =========================
   Mobile (no animations)
   ========================= */
export function TextMobile(props) {
  // Force no splitting, no GSAP
  return <TextBase {...props} splitMode={false} />;
}

/* =========================
   Desktop (GSAP animations)
   ========================= */
export function TextDesktop({
  animate = false, // false | true | 'letters' | 'words' | 'opacity'
  trigger = "mount", // 'mount' | 'scroll'
  once = true,
  ...props
}) {
  const scope = useRef(null);

  // Determine split mode (purely for rendering in Base)
  const splitMode = useMemo(() => {
    if (["words", "letters", "opacity"].includes(animate)) return animate;
    if (animate === true) return "letters";
    return false;
  }, [animate]);

  // Render first (DOM ready for GSAP)
  const rendered = (
    <div ref={scope}>
      <TextBase {...props} splitMode={splitMode} />
    </div>
  );

  // Run GSAP only if available and requested
  if (!gsap || !useGSAP) return rendered;

  useGSAP(
    () => {
      if (!splitMode || !scope.current) return;

      if (trigger === "mount") {
        if (splitMode === "opacity") {
          gsap.fromTo(
            scope.current.firstChild,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: "power2.out" }
          );
          return;
        }
        const targets =
          splitMode === "words"
            ? scope.current.querySelectorAll("[data-word]")
            : scope.current.querySelectorAll("[data-char]");
        if (!targets.length) return;

        gsap.set(targets, { opacity: 0, y: 18, display: "inline-block" });
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.03,
        });
        return;
      }

      if (trigger === "scroll") {
        const st = {
          trigger: scope.current,
          start: "top 85%",
          once,
          toggleActions: once
            ? "play none none none"
            : "play none none reverse",
        };

        if (splitMode === "opacity") {
          gsap.fromTo(
            scope.current.firstChild,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: st }
          );
          return;
        }

        const targets =
          splitMode === "words"
            ? scope.current.querySelectorAll("[data-word]")
            : scope.current.querySelectorAll("[data-char]");
        if (!targets.length) return;

        gsap.set(targets, { opacity: 0, y: 18, display: "inline-block" });
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.025,
          scrollTrigger: st,
        });
      }
    },
    { scope, dependencies: [splitMode, trigger, once] }
  );

  return rendered;
}

/* =========================
   Wrapper selector
   ========================= */
export default function Text(props) {
  const [mode, setMode] = useState("base"); // 'base' | 'mobile' | 'desktop'

  useEffect(() => {
    // Respect prefers-reduced-motion first
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    if (prefersReduced) return setMode("base");

    // Mobile detection: either narrow viewport or coarse pointer
    const isMobile =
      window.matchMedia?.("(max-width: 768px)")?.matches ||
      window.matchMedia?.("(pointer: coarse)")?.matches;

    setMode(isMobile ? "mobile" : "desktop");
  }, []);

  if (mode === "desktop") return <TextDesktop {...props} />;
  if (mode === "mobile") return <TextMobile {...props} />;
  return <TextBase {...props} />; // base during SSR / reduced motion
}
