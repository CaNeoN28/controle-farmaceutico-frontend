"use client";

import Menu from "@/components/Menu";
import styles from "./RecuperarSenha.module.scss";
import CenterBox from "@/components/CenterBox";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import InputContainer from "@/components/InputContainer";
import regexValidation from "@/utils/regexValidation";
import InputSenha from "@/components/InputSenha";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FetchAutenticacao from "@/fetch/autenticacao";

interface Params {
  token?: string;
}

interface Data {
  senha: string;
  confirmar_senha: string;
}

export default function RecuperarSenha({
  searchParams,
}: {
  searchParams: Params;
}) {
  const { token } = searchParams;

  const router = useRouter();
  const recuperarSenha = new FetchAutenticacao().recuperarSenha;

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<Data>({
    defaultValues: {
      confirmar_senha: "",
      senha: "",
    },
  });

  const onSubmit: SubmitHandler<Data> = async (data) => {
    const senha = data.senha

    if (senha && token)
      await recuperarSenha(token, senha)
        .then((res) => {
          const mensagem = res.data;

          setMensagem(mensagem);
        })
        .catch((err) => {
          const erro = err.response.data;

          console.log(erro)

          setErro("Não foi possível alterar a senha");
        });
  };

  if (token && !erro)
    return (
      <>
        <Menu />
        <main className={styles.main}>
          {!mensagem ? (
            <CenterBox
              cancelText="Cancelar"
              onCancel={(e) => {
                e.preventDefault();
                router.push("/");
              }}
              submitText="Salvar"
              onSubmit={handleSubmit(onSubmit)}
              titulo="Recuperação de senha"
            >
              <div className={styles.inputs}>
                <Controller
                  control={control}
                  name="senha"
                  rules={{
                    required: {
                      message: "Senha é obrigatória",
                      value: true,
                    },
                    pattern: {
                      message: "Senha inválida",
                      value: regexValidation.SENHA,
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <InputContainer
                        id="senha"
                        label="Nova senha"
                        error={errors.senha}
                      >
                        <InputSenha id="senha" {...{ ...field, ref: null }} />
                      </InputContainer>
                    );
                  }}
                />
                <Controller
                  control={control}
                  name="confirmar_senha"
                  rules={{
                    required: {
                      message: "Senha de confirmação é obrigatória",
                      value: true,
                    },
                    pattern: {
                      message: "Senha de confirmação inválida",
                      value: regexValidation.SENHA,
                    },
                    validate: (v: string) => {
                      const senha = watch("senha");

                      if (senha != v) {
                        return "As senhas não correspondem";
                      }
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <InputContainer
                        id="confirmar_senha"
                        label="Confirmar senha"
                        error={errors.confirmar_senha}
                      >
                        <InputSenha
                          id="confirmar_senha"
                          {...{ ...field, ref: null }}
                        />
                      </InputContainer>
                    );
                  }}
                />
              </div>
            </CenterBox>
          ) : (
            <CenterBox
              submitText="Ir para login"
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/login");
              }}
              titulo="SENHA ALTERADA COM SUCESSO"
            >
              <span className={styles.mensagem}>{mensagem}</span>
            </CenterBox>
          )}
        </main>
      </>
    );

  return (
    <>
      <Menu />
      <main className={styles.main}>
        <CenterBox
          submitText="Confirmar"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/");
          }}
        >
          <span className={styles.mensagem}>
            {erro || "Token inválido, não foi possível alterar sua senha"}
          </span>
        </CenterBox>
      </main>
    </>
  );
}
