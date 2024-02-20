import { ReactNode, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import styles from "./Secao.module.scss";
import classNames from "classnames";

interface Props {
  titulo: string | number;
  children?: ReactNode;
}

export default function Secao({ titulo, children }: Props) {
  const [ativo, setAtivo] = useState(false);

  const classes = classNames({
    [styles.secao]: true,
    [styles.ativo]: ativo,
  });

  return (
    <div className={classes}>
      <span className={styles.titulo} onClick={() => {setAtivo(!ativo)}}>
        {titulo}
        <FaChevronDown className={styles.icone}/>
      </span>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
