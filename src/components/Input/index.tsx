import React from "react";
import styles from "./Input.module.scss";

interface Props extends React.ComponentPropsWithoutRef<"input"> {}

export default function Input({ ...props }: Props) {
  return <input className={styles.input} type="text" {...props} />;
}
