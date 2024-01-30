"use client";

import Botao from "@/components/Botao";
import "./globals.css";

export default function Home() {
  return (
    <>
      <Botao
        fullWidth
        onClick={(e) => {
          e.preventDefault();
          console.log("Clicou primário");
        }}
      >
        Botão
      </Botao>
      <Botao
        fullWidth
        secundario
        onClick={(e) => {
          e.preventDefault();
          console.log("Clicou secundário");
        }}
      >
        Botão
      </Botao>
    </>
  );
}
