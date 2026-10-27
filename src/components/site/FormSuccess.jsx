import { ArrowIcon } from "./ArrowLink";

const ANGLES = ["0deg", "45deg", "90deg", "135deg", "180deg", "225deg", "270deg", "315deg"];

export function FormSuccess({ card = false, text }) {
  return (
    <div
      className={`form-success done${card ? " done--card" : ""}`}
      hidden
      role="status"
    >
      <div className="done__badge" aria-hidden="true">
        <span className="done__ring" />
        <span className="done__ring done__ring--late" />
        {ANGLES.map((angle) => (
          <i key={angle} style={{ "--a": angle }} />
        ))}
        <svg viewBox="0 0 52 52">
          <circle className="done__circle" cx="26" cy="26" r="24" />
          <path className="done__tick" d="m15.5 27 7 7 14-15" />
        </svg>
      </div>
      <h2 className="done__title">
        Thank you for <span>your request!</span>
      </h2>
      <p className="done__text">{text}</p>
      <a href="/" className="btn btn--lg done__back">
        Back to home
        <ArrowIcon />
      </a>
    </div>
  );
}
