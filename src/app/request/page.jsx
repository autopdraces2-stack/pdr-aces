import { ArrowIcon } from "@/components/site/ArrowLink";
import { FormSuccess } from "@/components/site/FormSuccess";
import { pageOpenGraph } from "@/lib/pageMeta";
import { isSiteAvailable } from "@/lib/siteAvailability";

const pageMetadata = {
  title: "Request Details | PDR Aces Academy",
  description:
    "Request details about the next PDR training session in Denver, Colorado.",
  openGraph: pageOpenGraph({
    url: "/assets/why-pdr.webp",
    width: 1632,
    height: 964,
    alt: "Hands-on paintless dent repair training",
  }),
};

export async function generateMetadata() {
  if (!isSiteAvailable()) return {};
  return pageMetadata;
}

export default function RequestPage() {
  return (
    <main className="page page--request">
      <div className="page__inner">
        <h1 className="page__title">
          Ready to learn <span>PDR?</span>
        </h1>
        <p className="page__lead">
          Interested in exploring paintless dent repair hands-on? Fill out the
          form and we’ll contact you with details
        </p>

        <form className="form" noValidate>
          <input
            className="form__fax"
            name="fax"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <label className="field">
            <span className="field__label">Your Name</span>
            <input type="text" name="name" autoComplete="name" required />
          </label>
          <label className="field">
            <span className="field__label">Phone Number</span>
            <input type="tel" className="js-phone" autoComplete="tel" required />
            <input type="hidden" name="phone" defaultValue="" />
          </label>
          <label className="field">
            <span className="field__label">Email Address</span>
            <input type="email" name="email" autoComplete="email" required />
          </label>
          <label className="field">
            <span className="field__label">Where did you see me?</span>
            <select name="source" required defaultValue="">
              <option value="" disabled>
                Choose one
              </option>
              <option>Instagram</option>
              <option>TikTok</option>
              <option>Facebook</option>
              <option>YouTube</option>
            </select>
          </label>
          <label className="field field--wide">
            <span className="field__label">
              Message <em>(optional)</em>
            </span>
            <textarea name="message" rows={4} />
          </label>

          <p className="form__error" hidden />

          <button type="submit" className="btn btn--lg form__submit">
            Send request
            <ArrowIcon />
          </button>
        </form>

        <FormSuccess
          card
          text="We’ve received your information and will contact you soon to discuss the training program."
        />
      </div>
    </main>
  );
}
