export function Unavailable() {
  return (
    <main className="page page--unavailable">
      <div className="unavailable">
        <img
          className="unavailable__logo"
          src="/assets/logo.png"
          alt="PDR Aces"
          width="1024"
          height="901"
        />
        <p className="page__eyebrow">PDR Aces Academy</p>
        <h1 className="page__title">
          The site is currently <span>unavailable</span>
        </h1>
        <p className="page__lead">Please check back soon.</p>
      </div>
    </main>
  );
}
