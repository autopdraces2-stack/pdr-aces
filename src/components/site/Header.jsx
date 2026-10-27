"use client";

import { usePathname } from "next/navigation";
import { ArrowLink } from "./ArrowLink";

export function Header() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const aboutHref = onHome ? "#about" : "/#about";
  const repairHref = onHome ? "#repair" : "/#repair";

  return (
    <header className="header">
      <nav className="nav">
        <button
          className="burger"
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls="menu"
        >
          <span />
          <span />
          <span />
        </button>
        <ul className="menu" id="menu">
          <li>
            <a href="/" className={pathname === "/" ? "active" : undefined}>
              Home
            </a>
          </li>
          <li>
            <a
              href="/training"
              className={
                pathname === "/training" || pathname === "/request"
                  ? "active"
                  : undefined
              }
            >
              PDR Training
            </a>
          </li>
          <li>
            <a href={aboutHref}>About</a>
          </li>
          <li>
            <a
              href={repairHref}
              className={pathname === "/estimate" ? "active" : undefined}
            >
              Dent repair
            </a>
          </li>
        </ul>
        <ArrowLink href="/training" className="afb afb--sm">
          Training Inquiry
        </ArrowLink>
      </nav>
    </header>
  );
}
