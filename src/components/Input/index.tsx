import React, { ReactNode } from "react";
import classNames from "classnames";
import styles from "./Input.module.scss";
import { IconType } from "react-icons";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
}

export default function Input({ label, children, ...props }: Props) {
  const id = props.id;

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}

      <input className={styles.input} type="text" {...props} />
    </div>
  );
}
