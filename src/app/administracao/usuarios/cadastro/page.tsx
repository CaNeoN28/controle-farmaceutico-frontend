"use client";

import Menu from "@/components/Menu";
import styles from "./CadastroUsuario.module.scss";
import FormularioUsuario from "../formulario";
import { CadastroMain } from "@/components/Cadastro";
import TituloSecao from "@/components/TituloSecao";
import { useEffect, useState } from "react";
import { IUsuarioAPI } from "@/types/Usuario";
import FetchAutenticacao from "@/fetch/autenticacao";
import { deleteCookie, getCookie } from "cookies-next";
import { postUsuario } from "@/fetch/usuario";
import FetchImagem from "@/fetch/imagens";
import { useRouter } from "next/navigation";
import { FieldError } from "react-hook-form";

export default function CadastroUsuario() {
  const router = useRouter()
  const fAuth = new FetchAutenticacao();
  const fImagem = new FetchImagem();

  const [imagem, setImagem] = useState<File>();
  const [erroImagem, setErroImagem] = useState<FieldError>();
  const [usuarioEditor, setUsuarioEditor] = useState<IUsuarioAPI>();
  const [token, setToken] = useState("");

  const getUsuario = async () => {
    const token = getCookie("authentication") || "";

    await fAuth
      .getPerfil(token)
      .then((res) => {
        const usuario = res.data as IUsuarioAPI;

        setToken(token);
        setUsuarioEditor(usuario);
      })
      .catch(() => {
        deleteCookie("authentication")
        router.push("/login")
      });
  };

  const fetchUsuario = async (data: IUsuarioAPI) => {
    let erroImagem = "";

    if (imagem) {
      await fImagem
        .postImagem(imagem)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          erroImagem = "Arquivo inválido";
        });
    }

    setErroImagem({
      type: "validate",
      message: erroImagem
    });

    if (!erroImagem) {
    }

    /*const response = postUsuario(data, token)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return;
      });*/
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
          <FormularioUsuario
            usuarioEditor={usuarioEditor}
            erroImagem={erroImagem}
            fetchUsuario={fetchUsuario}
            setImagem={setImagem}
          />
        </CadastroMain>
      </>
    );

  return <></>;
}
