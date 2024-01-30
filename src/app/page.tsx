"use client";

import Botao from "@/components/Botao";
import "./globals.css";
import { FaPlus } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <Botao fullWidth>
        Botão
        <FaPlus/>
      </Botao>
    </>
  );
}
