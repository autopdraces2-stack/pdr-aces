export function BeforeAfter({
  after,
  before,
  afterAlt,
  beforeAlt,
  label,
  hidden = false,
}) {
  return (
    <div
      className="cf__card cf__card--ba"
      role={hidden ? undefined : "group"}
      aria-roledescription={hidden ? undefined : "slide"}
      aria-label={hidden ? undefined : label}
      aria-hidden={hidden || undefined}
    >
      <div className="ba">
        <img className="ba__after" src={after} alt={afterAlt} draggable="false" />
        <img className="ba__before" src={before} alt={beforeAlt} draggable="false" />
        <span className="ba__tag ba__tag--before">Before</span>
        <span className="ba__tag ba__tag--after">After</span>
        <span className="ba__line">
          <button
            className="ba__knob"
            type="button"
            aria-label="Drag to compare before and after"
          >
            <svg viewBox="0 0 34 16" aria-hidden="true">
              <path d="M8 3 3 8l5 5M26 3l5 5-5 5" />
            </svg>
          </button>
        </span>
      </div>
    </div>
  );
}
