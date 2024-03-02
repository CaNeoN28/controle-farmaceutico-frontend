"use client";

import Menu from "@/components/Menu";
import styles from "./RecuperarSenha.module.scss";
import CenterBox from "@/components/CenterBox";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import InputContainer from "@/components/InputContainer";
import regexValidation from "@/utils/regexValidation";
import InputSenha from "@/components/InputSenha";
import { useRouter } from "next/navigation";

interface Params {
  token?: string;
}

interface Data {
  senha: string;
  confirmar_senha: string;
}

export default function RecuperarSenha({ params }: { params: Params }) {
  const { token } = params;

  const router = useRouter()

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

  const onSubmit: SubmitHandler<Data> = (data) => {
    console.log(data);
  };

  return (
    <>
      <Menu />
      <main className={styles.main}>
        <CenterBox
          cancelText="Cancelar"
          onCancel={(e) => {
            e.preventDefault()
            router.push("/")
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
                    <InputSenha id="confirmar_senha" {...{ ...field, ref: null }} />
                  </InputContainer>
                );
              }}
            />
          </div>
        </CenterBox>
      </main>
    </>
  );
}
