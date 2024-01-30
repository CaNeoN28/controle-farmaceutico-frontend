import React, { ReactNode } from "react";
import styles from "./Input.module.scss";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
}

export default function Input({ label, ...props }: Props) {
  return <input className={styles.input} type="text" {...props} />;
}
