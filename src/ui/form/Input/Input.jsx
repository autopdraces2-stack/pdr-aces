import { forwardRef } from "react";
import styles from "./Input.module.css";

const Input = forwardRef(function Input(
  { type = "text", error, className = "", ...props },
  ref
) {
  const cls = [styles.input, error ? styles.error : "", className]
    .filter(Boolean)
    .join(" ");

  return <input ref={ref} type={type} className={cls} {...props} />;
});

export default Input;
