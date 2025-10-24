import styles from "./Button.module.css";

export default function Button({
  children,
  icon = null,
  variant = "primary", // 'primary' | 'secondary' | 'success' | 'error'
  disabled = false,
  iconOnly = false,
  onClick,
  type = "button",
  className = "",
}) {
  const buttonClass = [
    styles.button,
    styles[variant],
    iconOnly ? styles.iconOnly : "",
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
    >
      {!iconOnly && children}
      {icon ? <span className={styles.icon}>{icon}</span> : null}
    </button>
  );
}
