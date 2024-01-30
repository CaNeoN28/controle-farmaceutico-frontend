"use client";

import Botao from "@/components/Botao";
import "./globals.css";
import { AiFillEdit } from "react-icons/ai";

export default function Home() {
  return (
    <>
      <Botao>
        Botão
        <AiFillEdit/>
      </Botao>
    </>
  );
}
