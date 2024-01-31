import { ReactNode } from "react";
import styles from "./InputContainer.module.scss";
import { FieldError } from "react-hook-form";

export default function InputContainer({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: FieldError;
  children: ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.head}>
        {label && (
          <label className={styles.label} htmlFor={id}>
            {label}
          </label>
        )}
        {error && <span className={styles.erro}>*{error.message}</span>}
      </div>

      {children}
    </div>
  );
}
