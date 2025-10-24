import styles from "./Background.module.css";

const Background = () => {
  return (
    <div className={styles.bgWrap} aria-hidden="true">
      <div className={styles.radial} />
      <div className={styles.grid} />
      <div className={styles.glow} />
    </div>
  );
};

export default Background;
