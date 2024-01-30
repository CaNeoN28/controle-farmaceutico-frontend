"use client";

import Botao from "@/components/Botao";
import "./globals.css";
import { FaPencilAlt } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <Botao>
        Botão
        <FaPencilAlt/>
      </Botao>
    </>
  );
}
