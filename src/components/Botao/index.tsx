import React, { ReactNode } from "react";
import classnames from "classnames";
import styles from "./Botao.module.scss";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  secundario?: boolean;
  fullWidth?: boolean;
  icone?: JSX.Element;
  children: ReactNode;
}

export default function Botao({
  secundario,
  fullWidth,
  children,
  icone,
  ...props
}: Props) {
  const classes = classnames({
    [styles.botao]: true,
    [styles.secundario]: secundario,
    "full-width": fullWidth,
    "box-shadow": true,
  });

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
