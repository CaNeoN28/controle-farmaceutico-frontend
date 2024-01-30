import React from "react";
import classNames from "classnames";
import styles from "./Input.module.scss";

interface Props extends React.ComponentPropsWithoutRef<"input"> {}

export default function Input({ ...props }: Props) {
  const classes = classNames({
    [styles.input]: true,
  });
  
  return (
    <div>
      <input className={classes} type="text" {...props} />
    </div>
  );
}
