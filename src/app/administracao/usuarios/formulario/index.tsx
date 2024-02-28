import styles from "./FormularioUsuario.module.scss";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
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
import LinkButton from "@/components/LinkButton";
import Select, { Opcao } from "@/components/Select";
import FetchEntidades from "@/fetch/entidades";
import IEntidade from "@/types/Entidades";
import { GetManyRequest } from "@/types/Requests";
import { IUsuarioAPI } from "@/types/Usuario";
import { ARRAY_FUNCOES } from "@/utils/funcaoAdministrativa";
import regexValidation from "@/utils/regexValidation";
import { validarCPF } from "@/utils/validation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import classNames from "classnames";

interface Props {
  usuarioData?: IUsuarioAPI;
  usuarioEditor: IUsuarioAPI;
  fetchUsuario: (data: IUsuarioAPI) => void;
}

export default function FormularioUsuario({
  usuarioData,
  usuarioEditor,
  fetchUsuario,
}: Props) {
  const fEntidades = new FetchEntidades();

  const {
    formState: { errors },
    control,
    setValue,
    handleSubmit,
  } = useForm<IUsuarioAPI>({
    defaultValues: usuarioData || {
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

  const [funcoes, setFuncoes] = useState<Opcao[]>([]);
  const [filtroFuncao, setFiltroFuncao] = useState("INATIVO");

  const [entidades, setEntidades] = useState<Opcao[]>([]);
  const [filtroEntidade, setFiltroEntidade] = useState("");

  const classesRedirectEntidade = classNames({
    [styles.link_button]: true,
    [styles.error]: errors.dados_administrativos,
  });

  const getFuncoesAdministrativas = () => {
    const funcaoEditor = ARRAY_FUNCOES.findIndex(
      (v) => v === usuarioEditor.dados_administrativos.funcao
    );

    const funcoes = ARRAY_FUNCOES.filter((v, i) => funcaoEditor <= i);

    const opcoes: Opcao[] = funcoes
      .map((v) => {
        return {
          label: v,
          valor: v,
        };
      })
      .filter((f) => new RegExp(filtroFuncao, "i").test(f.label));

    setFuncoes(opcoes);
  };

  const getEntidades = async () => {
    await fEntidades
      .getEntidades({
        limite: 10,
        nome_entidade: filtroEntidade,
      })
      .then((res) => {
        const { dados } = res.data as GetManyRequest<IEntidade[]>;

        const opcoes: Opcao[] = dados.map((d) => {
          return {
            label: d.nome_entidade,
            valor: d._id,
          };
        });

        setEntidades(opcoes);
      });
  };

  const onSubmit: SubmitHandler<IUsuarioAPI> = (data) => {
    const newData = { ...data, cpf: data.cpf.replaceAll(/([.-])+/g, "") };
    
    fetchUsuario(newData);
  };

  useEffect(() => {
    getFuncoesAdministrativas();
  }, [filtroFuncao]);

  useEffect(() => {
    getEntidades();
  }, [filtroEntidade]);

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
        <CadastroEtapa titulo="Dados administrativos">
          <CadastroInputs>
            <Controller
              control={control}
              name="dados_administrativos.funcao"
              rules={{
                required: {
                  value: true,
                  message: "Função é obrigatória",
                },
              }}
              render={({ field }) => {
                return (
                  <InputContainer
                    id="dados_administrativos.funcao"
                    label="Função"
                    error={
                      errors.dados_administrativos &&
                      errors.dados_administrativos.funcao
                    }
                  >
                    <Select
                      placeholder="USUARIO"
                      filtro={filtroFuncao}
                      opcoes={funcoes}
                      setFiltro={setFiltroFuncao}
                      setValue={setValue}
                      {...{ ...field, ref: null }}
                    />
                  </InputContainer>
                );
              }}
            />
            <Controller
              control={control}
              rules={{
                required: {
                  message: "Entidade relacionada é obrigatória",
                  value: true,
                },
              }}
              name="dados_administrativos.entidade_relacionada"
              render={({ field }) => {
                return (
                  <InputContainer
                    id="entidade_relacionada"
                    label="Entidade relacionada"
                    error={
                      errors.dados_administrativos &&
                      errors.dados_administrativos.entidade_relacionada
                    }
                  >
                    <Select
                      id="entidade_relacionada"
                      placeholder=""
                      filtro={filtroEntidade}
                      opcoes={entidades}
                      setFiltro={setFiltroEntidade}
                      setValue={setValue}
                      {...{ ...field, ref: null }}
                    />
                  </InputContainer>
                );
              }}
            />
            <div className={classesRedirectEntidade}>
              <LinkButton secundario link="/administracao/entidades/cadastro">
                <span>Nova entidade</span>
                <HiArrowTopRightOnSquare />
              </LinkButton>
            </div>
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
