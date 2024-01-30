import React from "react";
import styles from "./InputImagem.module.scss";
import classNames from "classnames";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  titulo: string;
}

export default function InputImagem({ titulo, ...props }: Props) {
  const id = props.id;

  const classes = classNames({
    [styles.label]: true,
    "box-shadow": true,
  });

  return (
    <div className={styles.container}>
      <label className={classes} htmlFor={id}>
        {titulo}
      </label>
      <input className={styles.input} type="file" {...props} />
    </div>
  );
}
