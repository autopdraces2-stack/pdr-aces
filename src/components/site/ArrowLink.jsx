export function ArrowLink({ href, className = "afb", children, ...props }) {
  return (
    <a href={href} className={className} {...props}>
      <span className="afb__text">{children}</span>
      <span className="afb__fill" aria-hidden="true" />
      <span className="afb__text afb__text--fill" aria-hidden="true">
        {children}
      </span>
      <span className="afb__circle" aria-hidden="true">
        <svg className="afb__arrow afb__arrow--in" viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <svg className="afb__arrow afb__arrow--out" viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
