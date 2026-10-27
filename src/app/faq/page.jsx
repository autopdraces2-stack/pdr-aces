const faqs = [
  {
    q: "How much should I budget for PDR tools?",
    a: "You should plan to spend around $5,000–$10,000 on tools. I’ll help you choose the right tools for your needs. This budget covers tools only; tuition is separate.",
  },
  {
    q: "Is this program beginner-friendly?",
    a: "Absolutely! No previous experience is needed. We’ll teach you everything from the basics.",
  },
  {
    q: "Can I join if I already have PDR experience?",
    a: "Of course! This program is also designed for technicians who want to improve their skills and learn new techniques.",
  },
  {
    q: "How long is the training program?",
    a: "Our program lasts two months and takes place in Denver, Colorado.",
  },
  {
    q: "Will I get to practice on real cars?",
    a: "Yes! Our training focuses on hands-on practice with real vehicles, helping you develop skills you’ll use in the field.",
  },
];

export const metadata = {
  title: "FAQ | PDR Aces Academy",
  description:
    "Frequently asked questions about the PDR Aces paintless dent repair training in Denver, Colorado.",
};

export default function FaqPage() {
  return (
    <main className="page page--faq">
      <div className="faq">
        <div className="faq__head">
          <p className="page__eyebrow">FAQ</p>
          <h1 className="page__title">
            Frequently asked <span>questions</span>
          </h1>
        </div>

        <div className="faq__list">
          {faqs.map((item, index) => {
            const n = String(index + 1).padStart(2, "0");
            const open = index === 0;
            return (
              <div className={`faq__item${open ? " is-open" : ""}`} key={item.q}>
                <h2 className="faq__q">
                  <button
                    type="button"
                    className="faq__toggle"
                    aria-expanded={open}
                    aria-controls={`faq-a${index + 1}`}
                    id={`faq-q${index + 1}`}
                  >
                    <span className="faq__num">{n}</span>
                    <span className="faq__text">{item.q}</span>
                    <span className="faq__icon" aria-hidden="true" />
                  </button>
                </h2>
                <div
                  className="faq__a"
                  id={`faq-a${index + 1}`}
                  role="region"
                  aria-labelledby={`faq-q${index + 1}`}
                >
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="faq__more">
          <p>Still have questions?</p>
          <a href="tel:+17204194566">+1 720-419-4566</a>
          <a href="mailto:autopdraces@gmail.com">autopdraces@gmail.com</a>
        </div>
      </div>
    </main>
  );
}
