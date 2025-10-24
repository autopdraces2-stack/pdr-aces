import styles from "./TrustList.module.css";
import { Text } from "@/ui";

export default function TrustList() {
  const items = [
    "Factory finish preserved",
    "Insurance-friendly",
    "Fast turnaround",
  ];

  return (
    <ul className={styles.trustList}>
      {items.map((text, i) => (
        <li key={i} className={styles.trustItem}>
          <span className={styles.bullet} />
          <Text className={styles.text} animate="opacity">
            {text}
          </Text>
        </li>
      ))}
    </ul>
  );
}
