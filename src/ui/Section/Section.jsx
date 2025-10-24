import styles from "./Section.module.css";

const Section = ({ children, id = "" }) => {
  return (
    <section className={styles.section} id={id}>
      {children}
    </section>
  );
};

export default Section;
