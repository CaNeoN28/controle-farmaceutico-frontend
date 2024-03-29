import { FaTrash } from "react-icons/fa";
import classNames from "classnames";
import styles from "./DiaPlantao.module.scss";
import { MouseEventHandler } from "react";

interface Props {
  data: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function DiaPlantao({ data, onClick }: Props) {
  const classes = classNames({
    [styles.diaplantao]: true,
    [styles.ativo]: !!onClick,
  });

  const date = new Date(data);

  if (isNaN(Number(date))) {
    return <></>;
  }

  const { dia, mes, ano } = {
    dia: String(date.getDate()),
    mes: String(date.getMonth() + 1),
    ano: String(date.getFullYear()),
  };

  return (
    <button className={classes} onClick={onClick}>
      <div className={styles.container}>
        <span>
          {dia.padStart(2, "0")}/{mes.padStart(2, "0")}
        </span>
        {onClick && <span className={styles.ano}>{ano}</span>}
      </div>
      <div className={styles.icone}>
        <FaTrash />
      </div>
    </button>
  );
}
