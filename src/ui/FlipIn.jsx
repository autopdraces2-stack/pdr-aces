"use client";

import { useRef, useMemo, useEffect, useState } from "react";

let gsap, ScrollTrigger, useGSAP;
try {
  ({ default: gsap } = require("gsap"));
  ({ ScrollTrigger } = require("gsap/ScrollTrigger"));
  ({ useGSAP } = require("@gsap/react"));
  gsap?.registerPlugin?.(ScrollTrigger);
} catch {}

export function FlipInBase({
  children,
  as = "div",
  className = "",
  perspective = 900,
  ...props
}) {
  const Component = as;

  return (
    <Component className={className} style={{ perspective }} {...props}>
      <div
        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
      >
        {children}
      </div>
    </Component>
  );
}

export function FlipInMobile(props) {
  return <FlipInBase {...props} />;
}

export function FlipInDesktop({
  children,
  as = "div",
  direction = "right", // "right" | "left" | "top" | "bottom"
  trigger = "scroll", // "scroll" | "mount"
  once = true,
  duration = 0.8,
  delay = 0,
  ease = "power3.out",
  opacity = 1,
  perspective = 900,
  className = "",
  ...props
}) {
  const Component = as;
  const scope = useRef(null);
  const inner = useRef(null);

  const cfg = useMemo(() => {
    switch (direction) {
      case "left":
        return { axis: "Y", from: -90, origin: "left center" };
      case "right":
        return { axis: "Y", from: 90, origin: "right center" };
      case "top":
        return { axis: "X", from: -90, origin: "center top" };
      case "bottom":
        return { axis: "X", from: 90, origin: "center bottom" };
      default:
        return { axis: "Y", from: 90, origin: "right center" };
    }
  }, [direction]);

  const rendered = (
    <Component
      ref={scope}
      className={className}
      style={{ perspective }}
      {...props}
    >
      <div
        ref={inner}
        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
      >
        {children}
      </div>
    </Component>
  );

  if (!gsap || !useGSAP) return rendered;

  const isReduced = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useGSAP(
    () => {
      if (!scope.current || !inner.current) return;

      gsap.set(scope.current, { perspective });
      gsap.set(inner.current, {
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        transformOrigin: cfg.origin,
      });

      if (isReduced) {
        gsap.set(inner.current, { clearProps: "all", opacity });
        return;
      }

      const fromVars =
        cfg.axis === "Y"
          ? { rotateY: cfg.from, opacity: 0, willChange: "transform, opacity" }
          : { rotateX: cfg.from, opacity: 0, willChange: "transform, opacity" };

      const toVars =
        cfg.axis === "Y"
          ? {
              rotateY: 0,
              opacity,
              duration,
              delay,
              ease,
              clearProps: "willChange",
            }
          : {
              rotateX: 0,
              opacity,
              duration,
              delay,
              ease,
              clearProps: "willChange",
            };

      gsap.set(inner.current, fromVars);

      const play = () => gsap.to(inner.current, toVars);

      if (trigger === "mount") {
        play();
        return;
      }

      const st = ScrollTrigger.create({
        trigger: scope.current,
        start: "top 85%",
        once,
        onEnter: play,
      });

      return () => st.kill();
    },
    {
      scope,
      dependencies: [
        direction,
        trigger,
        once,
        duration,
        delay,
        ease,
        opacity,
        perspective,
        isReduced,
        cfg.axis,
        cfg.from,
        cfg.origin,
      ],
    }
  );

  return rendered;
}

export default function FlipIn(props) {
  const [mode, setMode] = useState("base"); // 'base' | 'mobile' | 'desktop'

  useEffect(() => {
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    if (reduced) return setMode("base");

    const isMobile =
      window.matchMedia?.("(max-width: 768px)")?.matches ||
      window.matchMedia?.("(pointer: coarse)")?.matches;

    setMode(isMobile ? "mobile" : "desktop");
  }, []);

  if (mode === "desktop") return <FlipInDesktop {...props} />;
  if (mode === "mobile") return <FlipInMobile {...props} />;
  return <FlipInBase {...props} />;
}
