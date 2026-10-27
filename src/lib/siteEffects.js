import {
  MAX_PHOTO_BYTES,
  MAX_PHOTOS,
  PHOTO_PREPARING,
  PHOTO_TOO_LARGE,
  PHOTO_TOO_MANY,
  PHOTO_TYPE,
  photoUnreadable,
} from "./contactLimits";
import { isEstimateImage, prepareEstimatePhoto } from "./prepareEstimatePhoto";

export function initSiteEffects() {
  const cleanups = [];
  const ac = new AbortController();
  const { signal } = ac;
  let disposed = false;

  const on = (target, type, fn, options) => {
    if (!target) return;
    target.addEventListener(type, fn, { ...options, signal });
  };

  const legacyHomeHashes = {
    "section-contact": "contact",
    "section-contact-us": "contact",
    "section-pdr-course": "program",
    "section-auto-hail-repair": "repair",
    "section-paintless-dent-repair": "repair",
  };
  let legacyId = location.hash.slice(1);
  try {
    legacyId = decodeURIComponent(legacyId);
  } catch {
    /* Keep the raw fragment when it is not valid encoding. */
  }
  if (location.pathname === "/training" && legacyId === "section-contact") {
    location.replace("/request");
  } else if (location.pathname === "/" && legacyHomeHashes[legacyId]) {
    const next = legacyHomeHashes[legacyId];
    const el = document.getElementById(next);
    history.replaceState(null, "", "#" + next);
    if (el) {
      const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - offset);
    }
  }

  const burger = document.querySelector(".burger");
  const header = document.querySelector(".header");
  if (burger && header) {
    on(burger, "click", () => {
      const open = header.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    header.querySelectorAll("a").forEach((link) => {
      on(link, "click", () => {
        header.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  (() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return (y) => window.scrollTo(0, y);
    }
    const touch = matchMedia("(hover: none)").matches;
    const root = document.documentElement;
    const maxScroll = () => root.scrollHeight - window.innerHeight;
    const clampY = (y) => Math.max(0, Math.min(maxScroll(), y));
    const easeInOut = (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);
    let target = window.scrollY;
    let current = window.scrollY;
    let jump = null;
    let raf = 0;
    let lastSet = window.scrollY;

    function tick(now) {
      raf = 0;
      if (disposed) return;
      if (jump) {
        const t = Math.min(1, (now - jump.start) / jump.ms);
        current = jump.from + (jump.to - jump.from) * easeInOut(t);
        if (t === 1) {
          target = current = jump.to;
          jump = null;
        }
      } else {
        current += (target - current) * 0.1;
        if (Math.abs(target - current) < 0.5) current = target;
      }
      window.scrollTo(0, current);
      lastSet = window.scrollY;
      if (jump || current !== target) raf = requestAnimationFrame(tick);
    }
    const run = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    if (!touch) {
      on(
        window,
        "wheel",
        (e) => {
          if (e.ctrlKey || e.defaultPrevented) return;
          if (e.target.closest("textarea, select, [data-smooth-prevent]")) return;
          e.preventDefault();
          jump = null;
          const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1;
          target = clampY(target + e.deltaY * unit);
          run();
        },
        { passive: false }
      );
    }

    on(
      window,
      "scroll",
      () => {
        if (Math.abs(window.scrollY - lastSet) > 2) {
          jump = null;
          target = current = lastSet = window.scrollY;
        }
      },
      { passive: true }
    );

    function glide(y) {
      const to = clampY(y);
      const from = window.scrollY;
      const ms = Math.min(1600, Math.max(800, 650 + Math.abs(to - from) * 0.22));
      jump = { from, to, start: performance.now(), ms };
      current = lastSet = from;
      run();
    }

    on(document, "click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link || e.defaultPrevented) return;
      const id = link.getAttribute("href").slice(1);
      const el = id && document.getElementById(id);
      if (!el || !el.getClientRects().length || el.classList.contains("pg")) return;
      e.preventDefault();
      const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      history.pushState(null, "", "#" + id);
      glide(el.getBoundingClientRect().top + window.scrollY - offset);
    });

    cleanups.push(() => {
      if (raf) cancelAnimationFrame(raf);
    });
  })();

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const curtain = document.createElement("div");
    curtain.className = "curtain";
    curtain.setAttribute("aria-hidden", "true");
    document.body.append(curtain);
    cleanups.push(() => curtain.remove());
    let busy = false;

    const afterTransition = (fn) => {
      let done = false;
      const go = () => {
        if (done) return;
        done = true;
        curtain.removeEventListener("transitionend", onEnd);
        fn();
      };
      const onEnd = (e) => {
        if (!e.pseudoElement && e.propertyName === "opacity") go();
      };
      curtain.addEventListener("transitionend", onEnd);
      setTimeout(go, 1100);
    };
    const cover = (then) => {
      busy = true;
      curtain.classList.remove("is-reveal");
      curtain.classList.add("is-cover");
      afterTransition(then);
    };
    const reveal = () => {
      curtain.classList.add("is-reveal");
      afterTransition(() => {
        curtain.classList.add("no-anim");
        curtain.classList.remove("is-cover", "is-reveal");
        curtain.offsetWidth;
        curtain.classList.remove("no-anim");
        busy = false;
      });
    };

    on(document, "click", (e) => {
      if (
        busy ||
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const link = e.target.closest("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const href = link.getAttribute("href");

      if (href.startsWith("#")) {
        const el = document.getElementById(href.slice(1));
        if (!el || (!el.classList.contains("pg") && el.getClientRects().length && href !== "#home")) {
          return;
        }
        if (href === "#home" && el.getClientRects().length) return;
        e.preventDefault();
        cover(() => {
          location.hash = href;
          if (el.classList.contains("pg") || href === "#home") window.scrollTo(0, 0);
          requestAnimationFrame(reveal);
        });
        return;
      }

      let url;
      try {
        url = new URL(link.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin || !/^https?:|^file:/.test(url.protocol)) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      cover(() => {
        location.href = link.href;
      });
    });

    on(window, "pageshow", (e) => {
      if (!e.persisted) return;
      curtain.classList.add("no-anim");
      curtain.classList.remove("is-cover", "is-reveal");
      busy = false;
    });
  }

  const scrolly = document.querySelector(".scrolly");
  if (scrolly) {
    const canvas = scrolly.querySelector(".scrolly__canvas");
    const ctx = canvas.getContext("2d");
    const steps = scrolly.querySelectorAll(".scrolly__step");
    const bar = scrolly.querySelector(".scrolly__bar");
    const hero = document.querySelector(".hero");
    const topBar = document.querySelector(".header");
    const whyTitle = steps[0].querySelector(".feature__title");
    const whyCards = steps[0].querySelector(".cards");
    const endTitle = steps[1].querySelector(".feature__title");
    const endCards = steps[1].querySelector(".cards");
    const srcs = Array.from(
      { length: 120 },
      (_, i) => `/assets/scroll/frame-${String(i + 1).padStart(3, "0")}.webp`
    );
    const frames = srcs.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      return img;
    });

    const clamp = (v) => Math.min(1, Math.max(0, v));
    const ease = (v) => v * v * (3 - 2 * v);
    let current = "";
    let queued = false;

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      current = "";
    }

    function frameAt(i) {
      for (let d = 0; d < frames.length; d++) {
        for (const j of [i - d, i + d]) {
          const f = frames[j];
          if (f && f.complete && f.naturalWidth) return f;
        }
      }
      return null;
    }

    function draw() {
      queued = false;
      if (disposed) return;
      const rect = scrolly.getBoundingClientRect();
      const sticky = scrolly.firstElementChild.clientHeight;
      const p = clamp(-rect.top / (rect.height - sticky));

      const i = Math.round(clamp((p - 0.18) / 0.58) * (frames.length - 1));
      steps[0].classList.toggle("is-active", p < 0.22);
      steps[1].classList.toggle("is-active", p > 0.74);
      bar.style.setProperty("--p", p);

      if (hero) hero.style.setProperty("--hp", clamp(window.scrollY / hero.offsetHeight).toFixed(3));
      const enter = clamp(1 - (rect.top - topBar.offsetHeight) / window.innerHeight);
      scrolly.style.setProperty("--enter", enter.toFixed(3));

      const cw = canvas.width;
      const ch = canvas.height;
      const wide = cw / ch > 1.1;
      const start = Math.round((1 - ease(clamp((p - 0.18) / 0.14))) * 100) / 100;
      const end = Math.round(ease(clamp((p - 0.6) / 0.16)) * 100) / 100;

      const key = i + ":" + start + ":" + end + ":" + wide;
      if (key === current) return;
      const img = frameAt(i);
      if (!img) return;
      current = img === frames[i] ? key : "";

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      ctx.fillStyle = "#050409";
      ctx.fillRect(0, 0, cw, ch);

      const dpr = cw / canvas.clientWidth;
      const gap = 14 * dpr;
      const base = wide ? Math.max(cw / iw, ch / ih) : (cw * 1.3) / iw;
      let s = base;
      let y = wide ? (ch - ih * base) / 2 : ch * 0.09;
      const fit = (y0, y1, top, bot) => {
        const h = Math.min(ih * base, (y1 - y0) / (bot - top));
        return { s: h / ih, y: y1 - bot * h };
      };

      if (start > 0) {
        const pad = parseFloat(getComputedStyle(steps[0]).paddingTop) * dpr;
        const titleH = whyTitle.offsetHeight * dpr;
        const y0 = pad + titleH + gap;
        const y1 = whyCards.offsetTop * dpr - gap * 2;
        const L = fit(y0, y1, 0.35, 0.76);
        let margin;
        if (wide) {
          margin =
            Math.max(0, Math.round((L.y + 0.35 * L.s * ih - gap - titleH - pad) / dpr) - 28) + "px";
        } else {
          const carH = (0.76 - 0.35) * L.s * ih;
          const air = 34 * dpr;
          const groupTop = pad + Math.max(0, (y1 - pad - (titleH + air + carH)) * 0.15);
          L.y = groupTop + titleH + air - 0.35 * L.s * ih;
          margin = Math.max(0, Math.round((groupTop - pad) / dpr) - 22) + "px";
        }
        if (whyTitle.style.marginTop !== margin) whyTitle.style.marginTop = margin;
        s += (L.s - s) * start;
        y += (L.y - y) * start;
      }
      if (end > 0) {
        const L = fit(
          (endTitle.offsetTop + endTitle.offsetHeight) * dpr + gap,
          endCards.offsetTop * dpr - gap * 2,
          wide ? 0.45 : 0.28,
          0.96
        );
        s += (L.s - s) * end;
        y += (L.y - y) * end;
      }

      const w = iw * s;
      const h = ih * s;
      const x = ((cw - w) / 2) * (1 - (wide ? end : 0));
      ctx.drawImage(img, x, y, w, h);
      const edge = (x0, y0, x1, y1, rx, ry, rw, rh, a = 1) => {
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, "rgba(5,4,9,0)");
        g.addColorStop(1, `rgba(5,4,9,${a})`);
        ctx.fillStyle = g;
        ctx.fillRect(rx, ry, rw, rh);
      };
      if (y + h < ch) {
        const from = wide ? 0.85 : 0.6;
        edge(0, y + h * from, 0, y + h, 0, y + h * from, cw, h * (1 - from) + 1, wide ? 0.45 : 1);
      }
      if (y > 0) edge(0, y + h * 0.15, 0, y, 0, y, cw, h * 0.15);
      if (x > 0) edge(x + w * 0.12, 0, x, 0, x, 0, w * 0.12, ch);
      if (x + w < cw) edge(x + w * 0.88, 0, x + w, 0, x + w * 0.88, 0, w * 0.12, ch);
    }

    function requestDraw() {
      if (disposed || queued) return;
      queued = true;
      requestAnimationFrame(draw);
    }

    frames.forEach((img) => {
      img.onload = () => requestDraw();
    });

    size();
    on(window, "scroll", requestDraw, { passive: true });
    on(window, "resize", () => {
      size();
      requestDraw();
    });
    requestDraw();
  }

  document.querySelectorAll(".cf").forEach((root) => {
    const frame = root.querySelector(".cf__frame");
    const stage = root.querySelector(".cf__stage");
    const cards = [...root.querySelectorAll(".cf__card")];
    const photos = cards.length;
    while (cards.length < 5) {
      const copy = cards[cards.length % photos].cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      stage.append(copy);
      cards.push(copy);
      cleanups.push(() => copy.remove());
    }
    const count = cards.length;
    const rotate = 44;
    const depth = 0.6;
    const falloff = 0.56;
    const fade = 0.1;
    const gap = 0.05;

    let pos = 0;
    let target = 0;
    let width = 0;
    let raf = null;
    let drag = null;

    function paint() {
      if (!width || disposed) return;
      const pitch = width * (1 + gap);
      cards.forEach((card, i) => {
        let offset = (((i - pos) % count) + count) % count;
        if (offset > count / 2) offset -= count;
        const distance = Math.abs(offset);
        const ramp = Math.pow(distance, falloff);
        const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);
        card.style.transform = `translateX(calc(-50% + ${offset * pitch}px)) translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;
        const edge = Math.min(1, Math.max(0, count / 2 - distance));
        card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
        card.style.zIndex = String(100 - Math.round(distance));
      });
    }

    function settle(to) {
      if (raf !== null) cancelAnimationFrame(raf);
      target = to;
      const step = () => {
        if (disposed) return;
        const remaining = target - pos;
        if (Math.abs(remaining) < 0.0004) {
          pos = target;
          paint();
          raf = null;
          return;
        }
        pos += remaining * 0.16;
        paint();
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    const nudge = (by) => settle(Math.round(target) + by);

    on(root.querySelector(".cf__nav--prev"), "click", () => nudge(-1));
    on(root.querySelector(".cf__nav--next"), "click", () => nudge(1));
    on(frame, "keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        nudge(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nudge(1);
      }
    });

    on(frame, "pointerdown", (e) => {
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
    });
    const endTap = (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      const tap = Math.abs(e.clientX - drag.x) < 10 && Math.abs(e.clientY - drag.y) < 10;
      drag = null;
      if (!tap || e.type !== "pointerup") return;
      const start = Math.round(target);
      const card = document
        .elementsFromPoint(e.clientX, e.clientY)
        .find((el) => el.classList.contains("cf__card"));
      const i = cards.indexOf(card);
      if (i < 0) return;
      let to = (((i - start) % count) + count) % count;
      if (to > count / 2) to -= count;
      if (to) settle(start + to);
    };
    on(frame, "pointerup", endTap);
    on(frame, "pointercancel", endTap);

    const measure = () => {
      width = cards[0].offsetWidth;
      paint();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    cleanups.push(() => {
      observer.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    });
    measure();
  });

  document.querySelectorAll(".ba").forEach((ba) => {
    const line = ba.querySelector(".ba__line");
    const knob = ba.querySelector(".ba__knob");
    const card = ba.closest(".cf__card");
    const centred = () => !card || card.style.zIndex === "" || card.style.zIndex === "100";
    const set = (pct) => ba.style.setProperty("--pos", Math.min(100, Math.max(0, pct)) + "%");
    const fromPointer = (e) => {
      const r = ba.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    };
    let dragging = null;

    on(line, "pointerdown", (e) => {
      if (!centred()) return;
      e.stopPropagation();
      e.preventDefault();
      dragging = e.pointerId;
      line.setPointerCapture(e.pointerId);
      fromPointer(e);
    });
    on(line, "pointermove", (e) => {
      if (dragging === e.pointerId) fromPointer(e);
    });
    const stop = (e) => {
      if (dragging === e.pointerId) dragging = null;
    };
    on(line, "pointerup", stop);
    on(line, "pointercancel", stop);

    on(knob, "keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      e.stopPropagation();
      const now = parseFloat(getComputedStyle(ba).getPropertyValue("--pos")) || 50;
      set(now + (e.key === "ArrowLeft" ? -5 : 5));
    });
  });

  if (
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    "IntersectionObserver" in window
  ) {
    const words = ".hero__title, .work__title, .about__headline, .contact__title, .page__title";
    const blocks = [
      ".hero__text",
      ".hero .btn",
      ".about__photo",
      ".about__eyebrow",
      ".about__quote",
      ".about .afb",
      ".work__text",
      ".cf",
      ".work__cta",
      ".contact__text",
      ".contact__tile",
      ".page__eyebrow",
      ".page__lead",
      ".estimate__note",
      ".details",
      ".page__inner > .btn",
      ".page--request .form",
      ".estimate__card",
      ".faq__item",
      ".faq__more",
      ".footer__brand",
      ".footer__col",
      ".footer__bottom",
    ].join(", ");

    function split(el) {
      if (el.querySelector(".w")) return;
      let i = 0;
      (function walk(node) {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === 3) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) {
                frag.append(" ");
                return;
              }
              const w = document.createElement("i");
              w.className = "w";
              const inner = document.createElement("i");
              inner.style.setProperty("--i", i++);
              inner.textContent = part;
              w.append(inner);
              frag.append(w);
            });
            child.replaceWith(frag);
          } else if (child.nodeType === 1 && child.tagName !== "BR") {
            walk(child);
          }
        });
      })(el);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || disposed) return;
          const el = entry.target;
          el.classList.add("is-in");
          io.unobserve(el);
          if (el.dataset.reveal === "fade") {
            const wait = 1000 + (parseFloat(el.style.getPropertyValue("--d")) || 0) * 1000;
            const timer = setTimeout(() => {
              el.removeAttribute("data-reveal");
              el.classList.remove("is-in");
            }, wait);
            cleanups.push(() => clearTimeout(timer));
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    cleanups.push(() => io.disconnect());

    document.querySelectorAll(words).forEach((el) => {
      split(el);
      el.dataset.reveal = "words";
      io.observe(el);
    });
    document.querySelectorAll(blocks).forEach((el) => {
      el.dataset.reveal = "fade";
      const group = [...el.parentElement.children].filter((s) => s.matches(blocks));
      const step = group.indexOf(el);
      if (step > 0) el.style.setProperty("--d", (step * 0.12).toFixed(2) + "s");
      io.observe(el);
    });

    const heroDelays = { ".hero__text": 0.45, ".hero .btn": 0.6 };
    Object.entries(heroDelays).forEach(([sel, d]) => {
      document.querySelectorAll(sel).forEach((el) => el.style.setProperty("--d", d + "s"));
    });
  }

  document.querySelectorAll(".faq__toggle").forEach((btn) => {
    on(btn, "click", () => {
      const item = btn.closest(".faq__item");
      const open = !item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".faq__item.is-open").forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".faq__toggle").setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  document.querySelectorAll(".btn--cta").forEach((btn) => {
    on(btn, "pointerdown", (e) => {
      const r = btn.getBoundingClientRect();
      const dot = document.createElement("span");
      dot.className = "ripple";
      dot.style.left = e.clientX - r.left + "px";
      dot.style.top = e.clientY - r.top + "px";
      btn.append(dot);
      dot.addEventListener("animationend", () => dot.remove());
    });
  });

  const preparingForms = new Set();
  const submittingForms = new Set();
  const overLimitForms = new Set();
  const preparedPhotos = new WeakMap();

  function sameFileList(left, right) {
    if (left.length !== right.length) return false;
    for (let i = 0; i < left.length; i++) {
      const a = left[i];
      const b = right[i];
      if (a === b) continue;
      if (
        a.name !== b.name ||
        a.size !== b.size ||
        a.lastModified !== b.lastModified ||
        a.type !== b.type
      ) {
        return false;
      }
    }
    return true;
  }

  function syncSubmitButton(form) {
    const button = form?.querySelector('[type="submit"]');
    if (!button) return;
    button.disabled =
      preparingForms.has(form) || submittingForms.has(form) || overLimitForms.has(form);
  }

  function setPhotoLimit(form, input, over) {
    if (form) {
      if (over) overLimitForms.add(form);
      else overLimitForms.delete(form);
      if (!over) {
        const formError = form.querySelector(".form__error");
        if (formError && formError.textContent === PHOTO_TOO_MANY) {
          formError.hidden = true;
          formError.textContent = "";
        }
      }
    }
    if (input) input.setCustomValidity(over ? PHOTO_TOO_MANY : "");
    syncSubmitButton(form);
  }

  function setFormPreparing(form, on) {
    if (!form) return;
    if (on) preparingForms.add(form);
    else preparingForms.delete(form);
    syncSubmitButton(form);
    form.querySelectorAll(".upload__list button").forEach((btn) => {
      btn.disabled = preparingForms.has(form);
    });
    if (!on) {
      const formError = form.querySelector(".form__error");
      if (formError && formError.textContent === PHOTO_PREPARING) {
        formError.hidden = true;
        formError.textContent = "";
      }
    }
  }

  document.querySelectorAll(".upload").forEach((box) => {
    const input = box.querySelector(".upload__input");
    const drop = box.querySelector(".upload__drop");
    const list = box.querySelector(".upload__list");
    const error = box.querySelector(".upload__error");
    const form = box.closest("form");
    let files = [];
    let generation = 0;
    let syncing = false;
    let ignoreEcho = false;

    function showUploadError(messages) {
      if (!error) return;
      if (!messages.length) {
        error.hidden = true;
        error.textContent = "";
        return;
      }
      error.hidden = false;
      error.textContent = messages.join(" ");
    }

    function render() {
      list.querySelectorAll("img").forEach((img) => URL.revokeObjectURL(img.src));
      list.innerHTML = "";
      files.forEach((file, i) => {
        const li = document.createElement("li");
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", `Remove ${file.name}`);
        remove.disabled = preparingForms.has(form);
        remove.addEventListener("click", () => {
          if (preparingForms.has(form)) return;
          files.splice(i, 1);
          const over = files.length > MAX_PHOTOS;
          showUploadError(over ? [PHOTO_TOO_MANY] : []);
          setPhotoLimit(form, input, over);
          sync();
        });
        li.append(img, remove);
        list.append(li);
      });
    }
    function sync() {
      if (form) preparedPhotos.set(form, files.slice());
      ignoreEcho = true;
      syncing = true;
      try {
        const dt = new DataTransfer();
        files.forEach((f) => dt.items.add(f));
        input.files = dt.files;
      } catch {
        ignoreEcho = false;
        /* Older browsers still show the thumbnails and submit the prepared files. */
      } finally {
        syncing = false;
      }
      if (ignoreEcho) {
        queueMicrotask(() => {
          ignoreEcho = false;
        });
        setTimeout(() => {
          ignoreEcho = false;
        }, 0);
      }
      render();
    }

    on(input, "change", async () => {
      if (syncing) return;
      if (ignoreEcho) {
        ignoreEcho = false;
        return;
      }
      const picked = [...input.files];
      if (sameFileList(picked, files)) return;
      const run = ++generation;
      setFormPreparing(form, true);
      const messages = [];
      try {
        const accepted = [];
        let rejectedType = false;
        for (const file of picked) {
          if (run !== generation || disposed) return;
          if (await isEstimateImage(file)) accepted.push(file);
          else rejectedType = true;
        }
        if (run !== generation || disposed) return;
        if (rejectedType) messages.push(PHOTO_TYPE);

        const prepared = [];
        for (const file of accepted) {
          if (run !== generation || disposed) return;
          const jpeg = await prepareEstimatePhoto(file);
          if (run !== generation || disposed) return;
          if (jpeg) prepared.push(jpeg);
          else messages.push(photoUnreadable(file.name));
        }
        if (run !== generation || disposed) return;
        files = files.concat(prepared);
        const over = files.length > MAX_PHOTOS;
        if (over) messages.push(PHOTO_TOO_MANY);
        showUploadError(messages);
        setPhotoLimit(form, input, over);
        sync();
      } catch {
        if (run !== generation || disposed) return;
        const over = files.length > MAX_PHOTOS;
        const failure = [photoUnreadable("this photo")];
        if (over) failure.unshift(PHOTO_TOO_MANY);
        showUploadError(failure);
        setPhotoLimit(form, input, over);
        sync();
      } finally {
        if (run === generation && !disposed) setFormPreparing(form, false);
      }
    });
    ["dragenter", "dragover"].forEach((t) =>
      on(drop, t, () => drop.classList.add("is-over"))
    );
    ["dragleave", "drop"].forEach((t) =>
      on(drop, t, () => drop.classList.remove("is-over"))
    );
    cleanups.push(() => {
      list.querySelectorAll("img").forEach((img) => URL.revokeObjectURL(img.src));
    });
  });

  document.querySelectorAll(".form").forEach((form) => {
    on(form, "submit", async (e) => {
      e.preventDefault();
      const error = form.querySelector(".form__error");
      const button = form.querySelector('[type="submit"]');
      const showError = (message) => {
        if (!error) return;
        error.hidden = false;
        error.textContent = message;
      };

      const estimate = form.classList.contains("form--estimate");
      const photos = estimate
        ? (preparedPhotos.get(form) || []).filter((file) => file && file.size > 0)
        : [];
      const uploadInput = estimate ? form.querySelector(".upload__input") : null;
      const inputCount = uploadInput?.files?.length || 0;
      if (estimate && preparingForms.has(form)) {
        showError(PHOTO_PREPARING);
        return;
      }
      if (estimate && (photos.length > MAX_PHOTOS || inputCount > MAX_PHOTOS)) {
        setPhotoLimit(form, uploadInput, true);
        const uploadError = form.querySelector(".upload__error");
        if (uploadError) {
          uploadError.hidden = false;
          uploadError.textContent = PHOTO_TOO_MANY;
        }
        showError(PHOTO_TOO_MANY);
        form.reportValidity();
        return;
      }

      if (!form.reportValidity()) return;
      if (error) {
        error.hidden = true;
        error.textContent = "";
      }

      if (estimate) {
        const total = photos.reduce((sum, file) => sum + file.size, 0);
        if (total > MAX_PHOTO_BYTES) {
          showError(PHOTO_TOO_LARGE);
          return;
        }
      }

      if (button) {
        submittingForms.add(form);
        syncSubmitButton(form);
      }
      try {
        let res;
        if (estimate) {
          const body = new FormData(form);
          body.set("type", "estimate");
          body.delete("photos");
          photos.forEach((file) => body.append("photos", file));
          res = await fetch("/api/contact", { method: "POST", body });
        } else {
          const data = Object.fromEntries(new FormData(form).entries());
          data.type = "training";
          res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
        }
        const json = await res.json().catch(() => ({}));
        if (disposed) return;
        if (!res.ok || !json.ok) {
          throw new Error(json.error || "Failed to send request");
        }
        form.hidden = true;
        const done = form.parentElement.querySelector(".form-success");
        if (done) {
          done.hidden = false;
          done.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      } catch (err) {
        if (disposed) return;
        showError(err.message || "Something went wrong. Please try again.");
      } finally {
        if (!disposed && button) {
          submittingForms.delete(form);
          syncSubmitButton(form);
        }
      }
    });
  });

  return () => {
    disposed = true;
    ac.abort();
    preparingForms.clear();
    submittingForms.clear();
    overLimitForms.clear();
    document.querySelectorAll(".form").forEach((form) => syncSubmitButton(form));
    cleanups.forEach((fn) => fn());
  };
}
