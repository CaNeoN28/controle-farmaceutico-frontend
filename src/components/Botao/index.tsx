import { ReactNode } from "react";
import classnames from "classnames";
import styles from "./Botao.module.scss";

export default function Botao({
  secundario,
  children,
}: {
  secundario?: boolean;
  children: ReactNode;
}) {
  const classes = classnames({
    [styles.botao]: true,
    [styles.secundario]: secundario,
  });

  return <button className={classes}>{children}</button>;
}
