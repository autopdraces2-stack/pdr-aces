import styles from "./Label.module.css";

export default function Label({
  htmlFor,
  children,
  required = false,
  className = "",
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={[styles.label, className].filter(Boolean).join(" ")}
    >
      <span className={styles.text}>{children}</span>
      {required ? (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}
