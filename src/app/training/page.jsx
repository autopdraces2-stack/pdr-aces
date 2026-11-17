import { ArrowIcon } from "@/components/site/ArrowLink";
import { pageOpenGraph } from "@/lib/pageMeta";

export const metadata = {
  title: "PDR Training | PDR Aces Academy",
  description:
    "Paintless Dent Repair Training program: 2 months, hands-on, in Denver, Colorado.",
  openGraph: pageOpenGraph({
    url: "/assets/why-pdr.webp",
    width: 1632,
    height: 964,
    alt: "Hands-on paintless dent repair training",
  }),
};

export default function TrainingPage() {
  return (
    <main className="page page--training">
      <div className="page__inner">
        <p className="page__eyebrow">Program</p>
        <h1 className="page__title">
          Paintless Dent Repair <span>Experience</span>
        </h1>

        <dl className="details">
          <div className="details__row">
            <dt>Focus</dt>
            <dd>Real-World PDR Techniques</dd>
          </div>
          <div className="details__row">
            <dt>Location</dt>
            <dd>Denver, Colorado</dd>
          </div>
          <div className="details__row">
            <dt>Availability</dt>
            <dd>Contact for Details</dd>
          </div>
          <div className="details__row">
            <dt>Format</dt>
            <dd>Hands-On</dd>
          </div>
          <div className="details__row">
            <dt>Pricing</dt>
            <dd>Available Upon Request</dd>
          </div>
        </dl>

        <a href="/request" className="btn btn--lg">
          Request Experience Details
          <ArrowIcon />
        </a>
      </div>
    </main>
  );
}
