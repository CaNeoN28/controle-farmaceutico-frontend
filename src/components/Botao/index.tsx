import React, { ReactNode } from "react";
import classnames from "classnames";
import styles from "./Botao.module.scss";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  secundario?: boolean;
  vermelho?: boolean;
  especial?: boolean;
  fullWidth?: boolean;
  tamanho?: number | string;
  children: ReactNode;
}

export default function Botao({
  secundario,
  vermelho,
	especial,
  fullWidth,
  tamanho,
  children,
  ...props
}: Props) {
  const classes = classnames({
    [styles.botao]: true,
    [styles.secundario]: secundario,
    [styles.vermelho]: vermelho,
    [styles.especial]: especial,
    "full-width": fullWidth,
    "box-shadow": true,
  });

  const getTamanho = () => {
    if (tamanho) {
      return { width: tamanho };
    }

    return {};
  };

  return (
    <button className={classes} style={{ ...getTamanho() }} {...props}>
      {children}
    </button>
  );
}
