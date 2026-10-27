"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const aboutHref = onHome ? "#about" : "/#about";
  const repairHref = onHome ? "#repair" : "/#repair";

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <a href="/" className="footer__logo">
            <img src="/assets/logo.png" alt="PDR Aces" width="587" height="131" />
          </a>
          <p>Hands-on paintless dent repair training in Denver, Colorado.</p>
          <div className="footer__row">
            <div className="footer__social">
              <a
                href="https://www.facebook.com/share/18afWNNezM/?mibextid=wwXIfr"
                aria-label="PDR Aces on Facebook"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    className="fill"
                    d="M14 8.5V6.8c0-.8.5-1 1-1h2V2.2h-2.9C11 2.2 10 4.3 10 6.4v2.1H8v3.7h2V22h4v-9.8h2.8l.4-3.7H14z"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/pdraces?xtok=czZuemVyendhMWR2"
                aria-label="PDR Aces on Instagram"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle className="fill" cx="17.3" cy="6.7" r="1.1" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@pdraces?si=mp1aubAkAG2p0AoH"
                aria-label="PDR Aces on YouTube"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="5" width="20" height="14" rx="4" />
                  <path className="fill" d="m10 9 5 3-5 3z" />
                </svg>
              </a>
            </div>
            <a href="/faq" className="footer__faq">
              <b aria-hidden="true">?</b>FAQ
            </a>
          </div>
        </div>
        <nav className="footer__col" aria-label="Footer">
          <h3>Menu</h3>
          <a href="/">Home</a>
          <a href="/training">PDR Training</a>
          <a href={aboutHref}>About</a>
          <a href={repairHref}>Dent repair</a>
        </nav>
        <div className="footer__col">
          <h3>Contact</h3>
          <a href="tel:+17204194566">+1 720-419-4566</a>
          <a href="mailto:autopdraces@gmail.com">autopdraces@gmail.com</a>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© 2026 PDR Aces Academy. All rights reserved.</span>
        <span>Paintless Dent Repair Training</span>
      </div>
    </footer>
  );
}
