"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap"; // your single gsap instance (ScrollTrigger already registered there)

export function useReveal(scopeRef, opts = {}) {
  const localScope = useRef(null);
  const scope = scopeRef ?? localScope;

  const { once = true, start = "top 85%", y = 20, duration = 0.8 } = opts;

  useGSAP(
    () => {
      const root = scope.current || document.body;
      const items = gsap.utils.toArray("[data-reveal]", root);

      items.forEach((el) => {
        const chars = el.querySelectorAll("[data-char]");
        const words = el.querySelectorAll("[data-word]");
        const targets = chars.length ? chars : words.length ? words : [el];

        // support --delay: "80ms" | "0.12s" | "120"
        let cssDelay = 0;
        const v = getComputedStyle(el).getPropertyValue("--delay").trim();
        if (v) {
          if (v.endsWith("ms")) cssDelay = parseFloat(v) / 1000;
          else if (v.endsWith("s")) cssDelay = parseFloat(v);
          else {
            const n = parseFloat(v);
            cssDelay = isNaN(n) ? 0 : n / 1000;
          }
        }

        gsap.set(targets, {
          opacity: 0,
          y,
          display: "inline-block",
          willChange: "transform,opacity",
        });

        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration,
          ease: "power3.out",
          stagger: chars.length || words.length ? 0.035 : 0.08,
          delay: cssDelay,
          scrollTrigger: {
            trigger: el,
            start,
            once,
          },
          onComplete() {
            gsap.set(targets, { clearProps: "will-change" });
          },
        });
      });
    },
    { scope }
  );

  return scope;
}
