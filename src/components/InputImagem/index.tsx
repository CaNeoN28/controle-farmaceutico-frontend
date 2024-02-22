import React, { useEffect, useState } from "react";
import styles from "./InputImagem.module.scss";
import classNames from "classnames";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  titulo: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export default function InputImagem({ titulo, onChange, ...props }: Props) {
  const id = props.id;

  const [legenda, setLegenda] = useState<string>();

  const getLegenda = (nome: string | undefined, tamanho: number) => {
    if (tamanho == 1) {
      setLegenda(nome);
    } else if (tamanho > 1) {
      setLegenda(`${nome} e +${tamanho - 1}`);
    } else {
      setLegenda(undefined);
    }
  };
  
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={id}>
        {titulo}
      </label>
      <span className={styles.legenda}>{legenda}</span>
      <input
        className={styles.input}
        type="file"
        onChange={(e) => {
          onChange(e);

          const arquivos = e.target.files;

          if (arquivos && arquivos.length > 0) {
            const tamanho = arquivos.length;
            const nome = arquivos[0].name;

            getLegenda(nome, tamanho);
          } else {
            getLegenda(undefined, 0);
          }
        }}
        {...props}
      />
    </div>
  );
}
