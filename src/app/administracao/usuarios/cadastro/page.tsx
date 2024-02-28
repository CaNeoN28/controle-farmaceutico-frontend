"use client";

import Menu from "@/components/Menu";
import styles from "./CadastroUsuario.module.scss";
import FormularioUsuario from "../formulario";
import { CadastroMain } from "@/components/Cadastro";
import TituloSecao from "@/components/TituloSecao";

export default function CadastroUsuario() {
  return (
    <>
      <Menu />
      <CadastroMain>
        <TituloSecao>CADASTRO DE USUÁRIO</TituloSecao>
        <FormularioUsuario />
      </CadastroMain>
    </>
  );
}
