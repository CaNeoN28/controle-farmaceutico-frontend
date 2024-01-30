import React, { ReactNode } from "react";
import classnames from "classnames";
import styles from "./Botao.module.scss";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  secundario?: boolean;
  children: ReactNode;
}

export default function Botao({ secundario, children, ...props }: Props) {
  const classes = classnames({
    [styles.botao]: true,
    [styles.secundario]: secundario,
    "box-shadow": true,
  });

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
