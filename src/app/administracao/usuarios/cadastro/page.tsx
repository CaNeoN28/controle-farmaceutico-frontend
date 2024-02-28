"use client";

import Menu from "@/components/Menu";
import styles from "./CadastroUsuario.module.scss";
import FormularioUsuario from "../formulario";
import { CadastroMain } from "@/components/Cadastro";
import TituloSecao from "@/components/TituloSecao";
import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";
import { useEffect, useState } from "react";
import { IUsuarioAPI } from "@/types/Usuario";
import FetchAutenticacao from "@/fetch/autenticacao";
import { getCookie } from "cookies-next";

export default function CadastroUsuario() {
  redirecionarAutenticacao();

  const fAuth = new FetchAutenticacao();

  const [usuarioEditor, setUsuarioEditor] = useState<IUsuarioAPI>();

  const getUsuario = async () => {
    const token = getCookie("authentication") || "";

    await fAuth.getPerfil(token).then((res) => {
      const usuario = res.data as IUsuarioAPI;

      setUsuarioEditor(usuario);
    });
  };

  useEffect(() => {
    getUsuario();
  }, []);

  if (usuarioEditor)
    return (
      <>
        <Menu />
        <CadastroMain>
          <TituloSecao>CADASTRO DE USUÁRIO</TituloSecao>
          <FormularioUsuario usuarioEditor={usuarioEditor} />
        </CadastroMain>
      </>
    );

  return <></>;
}
