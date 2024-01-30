"use client";

import "./globals.css";
import InputContainer from "@/components/InputContainer";
import InputImagem from "@/components/InputImagem";
import { useEffect, useState } from "react";

export default function Home() {
  const [imagens, setImagens] = useState<FileList>();

  return (
    <>
      <InputContainer id="input" label="Label">
        <InputImagem
          id="input"
          titulo="Fazer envio"
          multiple
          onChange={(e) => {
            const arquivos = e.target.files;

            if (arquivos) {
              setImagens(arquivos);
            }
          }}
        />
      </InputContainer>
    </>
  );
}
