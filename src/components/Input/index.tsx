import React from "react";
import classNames from "classnames";
import styles from "./Input.module.scss";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
}

export default function Input({ label, ...props }: Props) {
  const id = props.id;
  const classes = classNames({
    [styles.input]: true,
  });

  return (
    <div className={styles.inputBox}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input className={classes} type="text" {...props} />
    </div>
  );
}
