import { ArrowIcon } from "@/components/site/ArrowLink";
import { FormSuccess } from "@/components/site/FormSuccess";
import { pageOpenGraph } from "@/lib/pageMeta";

export const metadata = {
  title: "Free Dent Repair Estimate | PDR Aces Academy",
  description:
    "Get a free paintless dent repair estimate in Denver, Colorado. Send photos of door dings or hail damage.",
  openGraph: pageOpenGraph({
    url: "/assets/ba-1-after.jpg",
    width: 760,
    height: 650,
    alt: "After: The same pillar straight again after repair",
  }),
};

export default function EstimatePage() {
  return (
    <main className="page page--estimate">
      <div className="estimate">
        <div className="estimate__intro">
          <p className="page__eyebrow">Dent repair</p>
          <h1 className="page__title">
            Get a free dent <span>repair estimate</span>
          </h1>
          <p className="page__lead">
            Door dings or hail damage? We offer professional paintless dent
            repair services in Denver, Colorado.
          </p>
          <p className="estimate__note">
            Fill out the form below and upload a few photos of the damage.
            We’ll review your request and get back to you with an estimate.
          </p>
        </div>

        <div className="estimate__card">
          <h2 className="estimate__title">Request an Estimate</h2>

          <form className="form form--estimate" noValidate>
            <label className="field field--wide">
              <span className="field__label">
                Your Name<b aria-hidden="true">*</b>
              </span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Enter your name"
                required
              />
            </label>
            <label className="field">
              <span className="field__label">Phone Number</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="Enter your phone number"
              />
            </label>
            <label className="field">
              <span className="field__label">Email Address</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
              />
            </label>
            <label className="field field--wide">
              <span className="field__label">Describe the Damage</span>
              <textarea
                name="damage"
                rows={4}
                placeholder="Tell us a little about the damage and where it’s located."
              />
            </label>

            <div className="field field--wide upload">
              <span className="field__label">
                Upload Photos of the Damage <em>Optional</em>
              </span>
              <label className="upload__drop">
                <input
                  className="upload__input"
                  type="file"
                  name="photos"
                  accept="image/*"
                  multiple
                />
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3M12 4v12M7 9l5-5 5 5" />
                </svg>
                <span className="upload__cta">Tap to add photos</span>
                <span className="upload__hint">
                  Add up to 5 photos of your vehicle. For the best results,
                  include a close-up of the dent and a photo from farther away.
                </span>
              </label>
              <ul className="upload__list" aria-live="polite" />
              <p className="upload__error" hidden>
                You can add up to 5 photos.
              </p>
            </div>

            <p className="form__error" hidden />

            <button type="submit" className="btn btn--lg form__submit">
              Get my free estimate
              <ArrowIcon />
            </button>
            <p className="form__note">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" />
                <path d="m8.5 12 2.5 2.5 4.5-5" />
              </svg>
              Free, no-obligation estimate. Final pricing may require an
              in-person inspection.
            </p>
          </form>

          <FormSuccess text="We’ve received your information and will contact you soon to discuss your repair." />
        </div>
      </div>
    </main>
  );
}
