"use client";

import { useRouter } from "next/navigation";
import styles from "./EditarUsuario.module.scss";
import FetchAutenticacao from "@/fetch/autenticacao";
import FetchImagem from "@/fetch/imagens";
import { deleteCookie, getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { IUsuarioAPI } from "@/types/Usuario";
import { getUsuario } from "@/fetch/usuarios";
import Menu from "@/components/Menu";
import Carregando from "@/components/Carregando";
import { CadastroMain } from "@/components/Cadastro";
import TituloSecao from "@/components/TituloSecao";
import FormularioUsuario from "../../formulario";
import { FieldError } from "react-hook-form";
import FetchEntidades from "@/fetch/entidades";
import IEntidade from "@/types/Entidades";

interface Params {
  id: string;
}

export default function EditarUsuario({ params }: { params: Params }) {
  const { id: id_usuario } = params;

  const router = useRouter();

  const getPerfil = new FetchAutenticacao().getPerfil;
  const fetchImagem = new FetchImagem();
  const fetchEntidade = new FetchEntidades();

  const [token, setToken] = useState<string>();
  const [usuarioLogado, setUsuarioLogado] = useState<IUsuarioAPI>();

  const [imagem, setImagem] = useState<File>();
  const [erroImagem, setErroImagem] = useState<FieldError>();

  const [nomeEntidade, setNomeEntidade] = useState("");
  const [usuario, setUsuario] = useState<IUsuarioAPI>();
  const [erro, setErro] = useState("");

  async function getUsuarioLogado() {
    const token = getCookie("authentication");

    await getPerfil(token)
      .then((res) => {
        const usuario = res.data;

        setUsuarioLogado(usuario);
        setToken(token);
      })
      .catch(() => {
        deleteCookie("authentication");
        router.push("/login");
      });
  }

  async function getUsuarioEdicao() {
    await getUsuario(id_usuario, token)
      .then((res) => {
        const usuario = res.data;

        setUsuario(usuario);
      })
      .catch(() => {
        setErro("Usuário não foi encontrado");
      });
  }

  async function getEntidade() {
    if (usuario) {
      await fetchEntidade
        .getEntidade(usuario.dados_administrativos.entidade_relacionada)
        .then((res) => {
          const entidade = res.data as IEntidade;

          setNomeEntidade(entidade.nome_entidade);
        })
        .catch((err) => {
          setUsuario({
            ...usuario,
            dados_administrativos: {
              ...usuario.dados_administrativos,
              entidade_relacionada: "",
            },
          });
        });
    }
  }

  async function fetchUsuario(data: IUsuarioAPI) {
    console.log(data);
  }

  useEffect(() => {
    getUsuarioLogado();
  }, []);

  useEffect(() => {
    getUsuarioEdicao();
  }, [token]);

  useEffect(() => {
    getEntidade()
  }, [usuario])

  if (usuarioLogado) {
    return (
      <>
        <Menu />
        {usuario ? (
          <CadastroMain>
            <TituloSecao>EDIÇÃO DE USUÁRIO</TituloSecao>
            <FormularioUsuario
              fetchUsuario={fetchUsuario}
              setImagem={setImagem}
              usuarioEditor={usuario}
              erroImagem={erroImagem}
              usuarioData={usuario}
              nome_entidade={nomeEntidade}
            />
          </CadastroMain>
        ) : erro ? (
          <div className={styles.erro}>{erro}</div>
        ) : (
          <Carregando />
        )}
      </>
    );
  }

  return <></>;
}
