"use client";

import "./globals.css";
import InputContainer from "@/components/InputContainer";
import InputImagem from "@/components/InputImagem";
import { useEffect, useState } from "react";

export default function Home() {
  const [imagem, setImagem] = useState<FileList>();

  useEffect(() => {
    console.log(imagem);
  }, [imagem]);

  return (
    <>
      <InputContainer id="input" label="Label">
        <InputImagem multiple onChange={(e) => {
          const imagem = e.target.files

          if(imagem){
            setImagem(imagem)
          }
        }}/>
      </InputContainer>
    </>
  );
}
