import { ReactNode } from "react";
import styles from "./InputContainer.module.scss";

export default function InputContainer({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}

      {children}
    </div>
  );
}
