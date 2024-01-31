import React, { useState } from "react";

interface Props extends React.ComponentPropsWithoutRef<"input"> {}

export default function InputSenha({ ...props }: Props) {
  const [ativo, setAtivo] = useState(true);

  return (
    <div>
      <input type={ativo ? "password" : "text"} />
      <button
        onClick={(e) => {
          e.preventDefault();
          setAtivo(!ativo);
        }}
      >
        Clique
      </button>
    </div>
  );
}
