import {
  CadastroBotoes,
  CadastroContainer,
  CadastroEtapa,
  CadastroForm,
  CadastroInputs,
} from "@/components/Cadastro";
import styles from "./FormularioEntidades.module.scss";
import Botao from "@/components/Botao";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import IEntidade from "@/types/Entidades";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import Select, { Opcao } from "@/components/Select";
import { fetchEstados, fetchMunicipios } from "@/fetch/localizacao";
import { getSiglaFromEstado } from "@/utils/estadosParaSigla";
import Checkbox from "@/components/Checkbox";

interface Props {
  entidade?: IEntidade;
  enviarEntidade: (data: IEntidade) => void;
}

export default function FormularioEntidade({
  entidade,
  enviarEntidade,
}: Props) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<IEntidade>({
    defaultValues: entidade || {
      ativo: false,
      estado: "",
      municipio: "",
      nome_entidade: "",
    },
  });

  const [municipios, setMunicipios] = useState<Opcao[]>([]);
  const [filtroMunicipio, setFiltroMunicipio] = useState("");

  const [estados, setEstados] = useState<Opcao[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("");

  const municipioExiste = async () => {
    const estado = watch("estado");
    const municipio = watch("municipio");
    const sigla = getSiglaFromEstado(estado);

    let existe = false;

    await fetchMunicipios(sigla).then((res) => {
      const municipios = res.data;

      existe = !!municipios.find((m) => m.nome === municipio);

      console.log(existe);
    });

    return existe;
  };

  const getMunicipios = async () => {
    const { estado } = watch();
    const sigla = getSiglaFromEstado(estado);

    await fetchMunicipios(sigla)
      .then((res) => {
        const municipios = res.data;

        const opcoes: Opcao[] = municipios
          .filter((m) => new RegExp(filtroMunicipio).test(m.nome))
          .sort((a, b) => (a.nome > b.nome ? 1 : -1))
          .map((m) => {
            return {
              label: m.nome,
              valor: m.nome,
            };
          });

        setMunicipios(opcoes);
      })
      .catch();
  };

  const getEstados = async () => {
    await fetchEstados()
      .then((res) => {
        const estados = res.data;

        const opcoes: Opcao[] = estados
          .filter((e) => new RegExp(filtroEstado).test(e.nome))
          .sort((a, b) => (a.nome > b.nome ? 1 : -1))
          .map((e) => {
            return {
              label: e.nome,
              valor: e.nome,
            };
          });

        setEstados(opcoes);
      })
      .catch();
  };

  const onSubmit: SubmitHandler<IEntidade> = (data) => {
    enviarEntidade(data);
  };

  useEffect(() => {
    municipioExiste().then((res) => {
      if (!res) {
        setValue("municipio", "");

        getMunicipios();

        setFiltroMunicipio("");
        setValue("municipio", "");
      } else {
        setFiltroMunicipio(watch("municipio"));
      }
    });

    setFiltroEstado(watch("estado"));
  }, [watch("estado")]);

  useEffect(() => {
    getEstados();
  }, [filtroEstado]);

  useEffect(() => {
    getMunicipios();
  }, [filtroMunicipio]);

  return (
    <CadastroContainer>
      <CadastroForm onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formulario}>
          <CadastroEtapa titulo="Dados da entidade">
            <CadastroInputs>
              <Controller
                control={control}
                name="nome_entidade"
                rules={{
                  required: {
                    message: "Nome da entidade é obrigatório",
                    value: true,
                  },
                  minLength: {
                    message: "Nome da entidade deve ter 3 carácteres",
                    value: 3,
                  },
                }}
                render={({ field }) => {
                  return (
                    <InputContainer
                      id="nome_entidade"
                      label="Nome da entidade"
                      error={errors.nome_entidade}
                    >
                      <Input id="nome_entidade" {...{ ...field, ref: null }} />
                    </InputContainer>
                  );
                }}
              />
              <Controller
                control={control}
                name="estado"
                rules={{
                  required: {
                    message: "Estado é obrigatório",
                    value: true,
                  },
                }}
                render={({ field }) => {
                  return (
                    <InputContainer
                      id="estado"
                      label="Estado"
                      error={errors.estado}
                    >
                      <Select
                        id="estado"
                        placeholder="Rondônia"
                        filtro={filtroEstado}
                        opcoes={estados}
                        setFiltro={setFiltroEstado}
                        setValue={setValue}
                        {...{ ...field, ref: null }}
                      />
                    </InputContainer>
                  );
                }}
              />
              <Controller
                control={control}
                name="municipio"
                rules={{
                  required: {
                    message: "Município é obrigatório",
                    value: true,
                  },
                }}
                render={({ field }) => {
                  return (
                    <InputContainer
                      id="municipio"
                      label="Municipio"
                      error={errors.municipio}
                    >
                      <Select
                        id="municipio"
                        placeholder="Município"
                        filtro={filtroMunicipio}
                        opcoes={municipios}
                        disabled={!watch("estado")}
                        setFiltro={setFiltroMunicipio}
                        setValue={setValue}
                        {...{ ...field, ref: null }}
                      />
                    </InputContainer>
                  );
                }}
              />
              <Controller
                control={control}
                name="ativo"
                render={({ field }) => {
                  return (
                    <InputContainer id="ativo" label="Situação">
                      <Checkbox
                        id="ativo"
                        inativo="Inativo"
                        ativo="Ativo"
                        {...{ ...field, ref: null, value: String(field.value) }}
                      />
                    </InputContainer>
                  );
                }}
              />
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
        </div>
      </CadastroForm>
    </CadastroContainer>
  );
}
