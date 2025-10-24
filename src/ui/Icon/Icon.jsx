import styles from "./Icon.module.css";

/**
 * Icon wrapper
 * @param {object} props
 * @param {React.ElementType} props.as     Required: lucide icon component
 * @param {"sm"|"md"|"lg"} [props.size]    Visual size (uses CSS)
 * @param {number} [props.strokeWidth]     Override stroke width
 * @param {string} [props.className]       Extra classes
 * @param {string} [props.title]           Accessible title (optional)
 * @param {boolean} [props.decorative]     If true, aria-hidden
 */
export default function Icon({
  as: IconCmp,
  size = "md",
  strokeWidth,
  className = "",
  title,
  decorative = true,
  ...rest
}) {
  const sizeClass = styles[size] || styles.md;
  const strokeClass =
    strokeWidth === 1
      ? styles["stroke-1"]
      : strokeWidth === 1.5
      ? styles["stroke-1_5"]
      : strokeWidth === 2
      ? styles["stroke-2"]
      : "";

  return (
    <span
      className={[styles.icon, sizeClass, strokeClass, className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      {...rest}
    >
      <IconCmp aria-label={decorative ? undefined : title} />
    </span>
  );
}
