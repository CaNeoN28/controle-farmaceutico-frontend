import React, { useState } from "react";
import styles from "./InputSenha.module.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Props extends React.ComponentPropsWithoutRef<"input"> {}

export default function InputSenha({ ...props }: Props) {
  const [ativo, setAtivo] = useState(true);

  const alterarAtivo = (e: React.MouseEvent) => {
    e.preventDefault();
    setAtivo(!ativo);
  };

  return (
    <div className={styles.container}>
      <input className={styles.input} type={ativo ? "password" : "text"} />
      <button className={styles.button} onClick={alterarAtivo}>
        {ativo ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  );
}
