import { ReactNode } from "react";
import classnames from "classnames";
import styles from "./Botao.module.scss";

export default function Botao({ children }: { children: ReactNode }) {
  const classes = classnames({
    [styles.botao]: true,
  });

  return <button className={classes}>{children}</button>;
}
