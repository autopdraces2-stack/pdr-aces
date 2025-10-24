import { forwardRef } from "react";
import styles from "./Textarea.module.css";

const Textarea = forwardRef(function Textarea(
  { className = "", ...props },
  ref
) {
  const cls = [styles.textarea, className].filter(Boolean).join(" ");
  return <textarea ref={ref} className={cls} {...props} />;
});

export default Textarea;
