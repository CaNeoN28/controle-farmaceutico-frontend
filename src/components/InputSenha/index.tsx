import React, { useState } from "react";
import styles from "./InputSenha.module.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import classNames from "classnames";

interface Props extends React.ComponentPropsWithoutRef<"input"> {}

export default function InputSenha({ ...props }: Props) {
  const [ativo, setAtivo] = useState(true);
  const [contador, setContador] = useState(1);

  const alterarAtivo = (e: React.MouseEvent) => {
    e.preventDefault();

    if (contador != 0) setContador(contador - 1);

    setAtivo(!ativo);
  };

  const classAtivo = classNames({
    [styles.icone]: true,
    [styles.ativo]: ativo,
    [styles.inativo]: !ativo,
  });

  const classInativo = classNames({
    [styles.icone]: true,
    [styles.ativo]: !ativo,
    [styles.inativo]: contador == 0 && ativo,
  });

  return (
    <div className={styles.container}>
      <input className={styles.input} type={ativo ? "password" : "text"} />
      <button className={styles.button} onClick={alterarAtivo}>
        <FaEye className={classAtivo} />
        <FaEyeSlash className={classInativo} />
      </button>
    </div>
  );
}
