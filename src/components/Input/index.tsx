import React, { ReactNode } from "react";
import classNames from "classnames";
import styles from "./Input.module.scss";
import { IconType } from "react-icons";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
  children?: ReactNode;
}

export default function Input({ label, children, ...props }: Props) {
  const id = props.id;
  const classes = classNames({
    [styles.input]: true,
  });

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}

      <div className={styles.inputBox}>
        <input className={classes} type="text" {...props} />
        {children && <div className={styles.child}>{children}</div>}
      </div>
    </div>
  );
}
