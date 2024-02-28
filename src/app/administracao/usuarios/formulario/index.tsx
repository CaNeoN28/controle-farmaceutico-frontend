import Botao from "@/components/Botao";
import {
  CadastroBotoes,
  CadastroContainer,
  CadastroEtapa,
  CadastroForm,
  CadastroInputs,
} from "@/components/Cadastro";
import Input from "@/components/Input";
import InputContainer from "@/components/InputContainer";
import InputImagem from "@/components/InputImagem";
import InputMascara from "@/components/InputMascara/indext";
import InputSenha from "@/components/InputSenha";
import { IUsuarioAPI } from "@/types/Usuario";
import regexValidation from "@/utils/regexValidation";
import { validarCPF } from "@/utils/validation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface Props {
  usuario?: IUsuarioAPI;
}

export default function FormularioUsuario({ usuario }: Props) {
  const {
    formState: { errors },
    control,
    watch,
    handleSubmit,
  } = useForm<IUsuarioAPI>({
    defaultValues: usuario || {
      cpf: "",
      email: "",
      dados_administrativos: {
        entidade_relacionada: "",
        funcao: "INATIVO",
      },
      nome_completo: "",
      imagem_url: "",
      nome_usuario: "",
      numero_registro: "",
      senha: "",
    },
  });

  const onSubmit: SubmitHandler<IUsuarioAPI> = (data) => {
    console.log(data);
  };

  return (
    <CadastroContainer>
      <CadastroForm onSubmit={handleSubmit(onSubmit)}>
        <CadastroEtapa titulo="Dados do usuário">
          <CadastroInputs>
            <Controller
              control={control}
              name="nome_completo"
              rules={{
                required: {
                  message: "Nome completo é obrigatório",
                  value: true,
                },
                minLength: {
                  message: "Nome completo deve ter 3 letras",
                  value: 3,
                },
              }}
              render={({ field }) => {
                return (
                  <InputContainer
                    id="nome_completo"
                    label="Nome completo"
                    error={errors.nome_completo}
                  >
                    <Input id="nome_completo" {...{ ...field, ref: null }} />
                  </InputContainer>
                );
              }}
            />
            <Controller
              control={control}
              name="nome_usuario"
              rules={{
                required: {
                  message: "Nome de usuário é obrigatório",
                  value: true,
                },
                pattern: {
                  value: regexValidation.NOME_USUARIO,
                  message: "Nome de usuário inválido",
                },
              }}
              render={({ field }) => {
                return (
                  <InputContainer
                    id="nome_usuario"
                    label="Nome de usuario"
                    error={errors.nome_usuario}
                  >
                    <Input id="nome_usuario" {...{ ...field, ref: null }} />
                  </InputContainer>
                );
              }}
            />
            <Controller
              control={control}
              name="email"
              rules={{
                required: {
                  message: "Email é obrigatório",
                  value: true,
                },
                pattern: {
                  message: "Email inválido",
                  value: regexValidation.EMAIL,
                },
              }}
              render={({ field }) => {
                return (
                  <InputContainer id="email" label="Email" error={errors.email}>
                    <Input id="email" {...{ ...field, ref: null }} />
                  </InputContainer>
                );
              }}
            />
            <Controller
              control={control}
              name="cpf"
              rules={{
                required: {
                  message: "CPF é obrigatório",
                  value: true,
                },
                validate: (v) => {
                  const cpf = v.replaceAll(/([-.])+/g, "");
                  const valido = validarCPF(cpf);

                  if (!valido) {
                    return "CPF inválido";
                  }
                },
              }}
              render={({ field }) => {
                return (
                  <InputContainer id="cpf" label="CPF" error={errors.cpf}>
                    <InputMascara
                      id="cpf"
                      mask="999.999.999-99"
                      placeholder="000.000.000-00"
                      {...{ ...field, ref: null }}
                    />
                  </InputContainer>
                );
              }}
            />
            <Controller
              control={control}
              name="numero_registro"
              rules={{
                required: {
                  message: "Número de registro é obrigatório",
                  value: true,
                },
                pattern: {
                  message: "Deve ser um valor numérico",
                  value: /(^[0-9]+$)/g,
                },
              }}
              render={({ field }) => {
                return (
                  <InputContainer
                    id="numero_registro"
                    label="Número de registro"
                    error={errors.numero_registro}
                  >
                    <Input
                      id="numero_registro"
                      {...{ ...field, ref: null }}
                      placeholder="0000"
                    />
                  </InputContainer>
                );
              }}
            />
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
                  <InputContainer id="senha" label="Senha" error={errors.senha}>
                    <InputSenha id="senha" {...{ ...field, ref: null }} />
                  </InputContainer>
                );
              }}
            />
            <InputContainer id="imagem" label="Imagem de perfil">
              <InputImagem
                id="imagem"
                onChange={() => {}}
                titulo="Enviar arquivo"
              />
            </InputContainer>
          </CadastroInputs>
        </CadastroEtapa>
        <CadastroBotoes>
          <Botao fullWidth type="submit">
            Salvar
          </Botao>
          <Botao fullWidth secundario>
            Cancelar
          </Botao>
        </CadastroBotoes>
      </CadastroForm>
    </CadastroContainer>
  );
}
