"use client";

import { useRef, useEffect, useMemo, useState } from "react";

let gsap, ScrollTrigger, useGSAP;
try {
  ({ default: gsap } = require("gsap"));
  ({ ScrollTrigger } = require("gsap/ScrollTrigger"));
  ({ useGSAP } = require("@gsap/react"));
  gsap?.registerPlugin?.(ScrollTrigger);
} catch {}

export function SlideInBase({
  children,
  as = "div",
  className = "",
  style = {},
  ...props
}) {
  const Component = as;
  return (
    <Component className={className} style={style} {...props}>
      {children}
    </Component>
  );
}

export function SlideInMobile(props) {
  return <SlideInBase {...props} />;
}

export function SlideInDesktop({
  children,
  as = "div",
  from = "left", // "left" | "right"
  trigger = "scroll", // "scroll" | "mount"
  once = true,
  duration = 0.8,
  delay = 0,
  ease = "power3.out",
  distance = 100,
  opacity = 1,
  className = "",
  style = {},
  ...props
}) {
  const Component = as;
  const scope = useRef(null);

  const rendered = (
    <Component ref={scope} className={className} style={style} {...props}>
      {children}
    </Component>
  );

  if (!gsap || !useGSAP) return rendered;

  const isReduced = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useGSAP(
    () => {
      if (!scope.current) return;

      if (isReduced) {
        gsap.set(scope.current, { clearProps: "all", opacity });
        return;
      }

      const xFrom = from === "left" ? -distance : distance;

      gsap.set(scope.current, {
        x: xFrom,
        opacity: 0,
        willChange: "transform, opacity",
      });

      const animateIn = () => {
        gsap.to(scope.current, {
          x: 0,
          opacity,
          duration,
          delay,
          ease,
          clearProps: "willChange",
        });
      };

      if (trigger === "mount") {
        animateIn();
        return;
      }

      const st = ScrollTrigger.create({
        trigger: scope.current,
        start: "top 85%",
        once,
        onEnter: animateIn,
      });

      return () => st.kill();
    },
    {
      scope,
      dependencies: [
        from,
        trigger,
        once,
        duration,
        delay,
        ease,
        distance,
        opacity,
        isReduced,
      ],
    }
  );

  return rendered;
}

export default function SlideIn(props) {
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

  if (mode === "desktop") return <SlideInDesktop {...props} />;
  if (mode === "mobile") return <SlideInMobile {...props} />;
  return <SlideInBase {...props} />;
}
