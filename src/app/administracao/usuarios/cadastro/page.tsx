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
import Alert from "@/components/Alert";
import Botao from "@/components/Botao";

export default function CadastroUsuario() {
  const router = useRouter();
  const fAuth = new FetchAutenticacao();
  const fImagem = new FetchImagem();

  const [imagem, setImagem] = useState<File>();
  const [erroImagem, setErroImagem] = useState<FieldError>();
  const [erros, setErros] = useState<{ [key: string]: FieldError }>({});

  const [mensagemCriacao, setMensagemCriacao] = useState("");
  const [erroCriacao, setErroCriacao] = useState("");

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
        deleteCookie("authentication");
        router.push("/login");
      });
  };

  const fetchUsuario = async (data: IUsuarioAPI) => {
    let erroImagem = "";
    let urlImagem = "";

    if (imagem) {
      await fImagem
        .postImagem(imagem)
        .then((res) => {
          urlImagem = res.data[0];

          setErroImagem(undefined);
        })
        .catch((err) => {
          erroImagem = "Arquivo inválido";

          setErroImagem({
            type: "validate",
            message: erroImagem,
          });
        });
    }

    if (!erroImagem) {
      await postUsuario(data, token)
        .then((res) => {
          setMensagemCriacao("Usuário cadastrado com sucesso")
        })
        .catch((err) => {
          const data = err.response.data;
          const erros: { [key: string]: FieldError } = {};

          Object.keys(data).map((k) => {
            if (!erros[k]) {
              erros[k] = {
                message: data[k],
                type: "validate",
              };
            }
          });

          setErros(erros);
          setErroCriacao("Não foi possível criar o usuário")

          if (urlImagem) fImagem.removeImagem(erroImagem);
        });
    }
  };

  useEffect(() => {
    getUsuario();
  }, []);

  useEffect(() => {
    setErroImagem(undefined);
  }, [imagem]);

  if (usuarioEditor)
    return (
      <>
        <Menu />
        <CadastroMain>
          <TituloSecao>CADASTRO DE USUÁRIO</TituloSecao>
          <FormularioUsuario
            usuarioEditor={usuarioEditor}
            erroImagem={erroImagem}
            erros={erros}
            fetchUsuario={fetchUsuario}
            setImagem={setImagem}
          />
        </CadastroMain>
        <Alert
          show={!!mensagemCriacao}
          onClickBackground={() => {
            setMensagemCriacao("");
            router.back();
          }}
        >
          <div className={styles.alert}>
            <span className={styles.alert_texto}>{mensagemCriacao}</span>
            <Botao
              fullWidth
              onClick={() => {
                setMensagemCriacao("");
                router.back();
              }}
            >
              Confirmar
            </Botao>
          </div>
        </Alert>
        <Alert
          show={!!erroCriacao}
          onClickBackground={() => {
            setErroCriacao("");
            router.back();
          }}
        >
          <div className={styles.alert}>
            <span className={styles.alert_texto}>{erroCriacao}</span>
            <div className={styles.alert_opcoes}>
              <Botao
                fullWidth
                onClick={() => {
                  setErroCriacao("");
                }}
              >
                Continuar
              </Botao>
              <Botao
                secundario
                fullWidth
                onClick={() => {
                  setErroCriacao("");
                  router.back();
                }}
              >
                Cancelar
              </Botao>
            </div>
          </div>
        </Alert>
      </>
    );

  return <></>;
}
