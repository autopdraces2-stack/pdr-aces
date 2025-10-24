import styles from "./PageWrapper.module.css";

export default function PageWrapper({ children, className = "" }) {
  return <div className={`${styles.wrapper} ${className}`}>{children}</div>;
}
