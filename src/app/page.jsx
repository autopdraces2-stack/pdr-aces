import { ArrowIcon, ArrowLink } from "@/components/site/ArrowLink";
import { BeforeAfter } from "@/components/site/BeforeAfter";

export const metadata = {
  title: "PDR Aces Academy | Paintless Dent Repair Training",
  description:
    "Hands-on paintless dent repair training in Denver, Colorado. Learn PDR in 2 months.",
};

const pairs = [
  {
    after: "/assets/ba-1-after.jpg",
    before: "/assets/ba-1-before.jpg",
    afterAlt: "After: The same pillar straight again after repair",
    beforeAlt: "Before: A crease on the rear pillar under the PDR light",
    label: "Before and after 1",
  },
  {
    after: "/assets/ba-2-after.jpg",
    before: "/assets/ba-2-before.jpg",
    afterAlt: "After: The roof rail smooth again after repair",
    beforeAlt: "Before: Hail dents along a black roof rail",
    label: "Before and after 2",
  },
  {
    after: "/assets/ba-3-after.jpg",
    before: "/assets/ba-3-before.jpg",
    afterAlt: "After: The blue hood straight again after repair",
    beforeAlt: "Before: A dent in the edge of a blue hood",
    label: "Before and after 3",
  },
  {
    after: "/assets/ba-4-after.jpg",
    before: "/assets/ba-4-before.jpg",
    afterAlt: "After: The green hood straight again after repair",
    beforeAlt: "Before: A dent in a green hood under the PDR light",
    label: "Before and after 4",
  },
  {
    after: "/assets/ba-5-after.png",
    before: "/assets/ba-5-before.png",
    afterAlt: "After: The silver quarter panel straight again after repair",
    beforeAlt: "Before: A deep dent in a silver quarter panel",
    label: "Before and after 5",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <h1 className="visually-hidden">PDRaces Academy</h1>
        <div className="hero__content">
          <p className="hero__title">
            Learn paintless
            <br />
            dent repair
            <br />
            <span>in 2 months</span>
          </p>
          <p className="hero__text">
            Hands-on PDR training in Denver, Colorado. Learn professional dent
            repair techniques and develop the skills to start your journey in
            the industry.
          </p>
          <a href="/training" className="btn btn--lg btn--cta">
            Explore training
            <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="scrolly" id="why">
        <div className="scrolly__sticky">
          <canvas className="scrolly__canvas" aria-hidden="true" />

          <div className="feature feature--why scrolly__step" data-step="1">
            <h2 className="feature__title">
              Why Learn <span>PDR?</span>
            </h2>
            <ol className="cards cards--3">
              <li className="card">
                <span className="card__num">01</span>
                <svg className="card__icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />
                </svg>
                <h3 className="card__title">Learn a Specialized Skill</h3>
              </li>
              <li className="card">
                <span className="card__num">02</span>
                <svg className="card__icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
                </svg>
                <h3 className="card__title">Build a Career or Business</h3>
              </li>
              <li className="card">
                <span className="card__num">03</span>
                <svg className="card__icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 11V6a2 2 0 0 1 4 0v4M11 10V4a2 2 0 0 1 4 0v6M15 10V6a2 2 0 0 1 4 0v8a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-2.6-4.4a1.8 1.8 0 0 1 3-1.9L7 14" />
                </svg>
                <h3 className="card__title">Get Hands-On Experience</h3>
              </li>
            </ol>
          </div>

          <div className="feature feature--path scrolly__step" data-step="2" id="program">
            <h2 className="feature__title">
              From beginner to <span>real-world repairs</span>
            </h2>
            <ol className="cards cards--4">
              <li className="card">
                <span className="card__num">01</span>
                <h3 className="card__title">PDR Fundamentals</h3>
                <p className="card__text">Understand dents, lighting and metal movement.</p>
              </li>
              <li className="card">
                <span className="card__num">02</span>
                <h3 className="card__title">Tools & Techniques</h3>
                <p className="card__text">Learn rods, glue pulling and knockdown work.</p>
              </li>
              <li className="card">
                <span className="card__num">03</span>
                <h3 className="card__title">Hail Damage Repair</h3>
                <p className="card__text">Assess and repair hail-damaged panels.</p>
              </li>
              <li className="card">
                <span className="card__num">04</span>
                <h3 className="card__title">Real Vehicle Practice</h3>
                <p className="card__text">Build your skills through supervised practice.</p>
              </li>
            </ol>
          </div>

          <div className="scrolly__bar" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about__photo">
          <div className="about__frame">
            <img
              src="/assets/nick-garage.webp"
              alt="Nikita, founder of PDR Aces, in his workshop"
              width="1558"
              height="1009"
              loading="lazy"
            />
          </div>
          <div className="about__badge">
            <strong>700+</strong>
            <span>
              vehicles
              <br />
              repaired
            </span>
          </div>
        </div>

        <div className="about__content">
          <h2 className="about__eyebrow">Meet Your Instructor</h2>
          <p className="about__headline">
            <span>Real experience</span> Real repairs
            <br />
            Real training
          </p>
          <blockquote className="about__quote">
            <p>
              I’m Nikita, founder of PDR Aces. I work with dealerships and body
              shops across the United States, repairing everything from small
              dents to heavily hail-damaged vehicles. Now I’m sharing the
              techniques and experience I’ve developed through professional PDR
              work.
            </p>
            <footer>
              Nikita <span>Founder, PDR Aces</span>
            </footer>
          </blockquote>
          <ArrowLink
            href="https://youtu.be/E4osIC1YJtw?si=ggQ4CJCgX5MNmXVU"
            target="_blank"
            rel="noopener"
          >
            How It All Started
          </ArrowLink>
        </div>
      </section>

      <section className="work" id="repair">
        <div className="work__head">
          <h2 className="work__title">
            Need dent <span>repair?</span>
          </h2>
          <p className="work__text">
            We offer professional paintless dent repair services in Denver,
            Colorado. Send us photos of your damage to request an estimate.
          </p>
          <p className="work__text">
            Dealership hit by hail? Our team travels nationwide to handle
            large-scale hail damage repairs for dealerships and body shops.
            Contact us to discuss your repair needs.
          </p>
        </div>
        <div
          className="cf"
          role="region"
          aria-roledescription="carousel"
          aria-label="My work photos"
        >
          <div className="cf__frame" tabIndex="0">
            <div className="cf__stage">
              {pairs.map((pair) => (
                <BeforeAfter key={pair.label} {...pair} />
              ))}
            </div>
          </div>
          <button className="cf__nav cf__nav--prev" type="button" aria-label="Previous photo">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button className="cf__nav cf__nav--next" type="button" aria-label="Next photo">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
        <div className="work__cta">
          <ArrowLink href="/estimate">Get a repair estimate</ArrowLink>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact__head">
          <h2 className="about__eyebrow">Contact us</h2>
          <p className="contact__title">
            Let’s get you <span>started</span>
          </p>
          <p className="contact__text">
            Questions about the training or dent repair? Call or send an email,
            and we’ll get back to you.
          </p>
        </div>

        <div className="contact__grid">
          <a className="contact__tile" href="tel:+17204194566">
            <span className="contact__icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
            </span>
            <span className="contact__label">Phone</span>
            <span className="contact__value">+1 720-419-4566</span>
            <span className="contact__action">
              Tap to call
              <ArrowIcon />
            </span>
          </a>
          <a className="contact__tile" href="mailto:autopdraces@gmail.com">
            <span className="contact__icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16v12H4z" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </span>
            <span className="contact__label">Email</span>
            <span className="contact__value">autopdraces@gmail.com</span>
            <span className="contact__action">
              Send an email
              <ArrowIcon />
            </span>
          </a>
        </div>
      </section>
    </main>
  );
}
