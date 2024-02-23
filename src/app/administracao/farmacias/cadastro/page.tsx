"use client";

import Botao from "@/components/Botao";
import styles from "./CadastroFarmacia.module.scss";
import Menu from "@/components/Menu";
import TituloSecao from "@/components/TituloSecao";
import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import IFarmacia from "@/types/Farmacia";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";
import InputMascara from "@/components/InputMascara/indext";
import InputImagem from "@/components/InputImagem";
import {
	CadastroForm,
	CadastroMain,
	CadastroEtapa,
	CadastroInputs,
	CadastroBotoes,
} from "@/components/Cadastro";
import { validarCNPJ } from "@/utils/validation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
	fetchEstados,
	fetchMunicipios,
	getDadosCep,
	getEstadoFromSigla,
} from "@/fetch/localizacao";
import Select, { Opcao } from "@/components/Select";
import { getSiglaFromEstado } from "@/utils/estadosParaSigla";
import Map from "@/components/Map";
import { Coordenadas } from "@/types/Localizacao";

export default function CadastroFarmacia() {
	const {
		formState: { errors },
		control,
		handleSubmit,
		watch,
		setError,
		setValue,
		clearErrors,
	} = useForm<IFarmacia>({
		defaultValues: {
			cnpj: "",
			nome_fantasia: "",
			endereco: {
				cep: "",
				estado: "",
				municipio: "",
				bairro: "",
				logradouro: "",
				numero: "",
			},
		},
	});

	const [pesquisaEstado, setPesquisaEstado] = useState("");
	const [estados, setEstados] = useState<Opcao[]>([]);

	const [pesquisaMunicipio, setPesquisaMunicipio] = useState("");
	const [municipios, setMunicipios] = useState<Opcao[]>([]);

	const [localizacao, setLocalizacao] = useState<Coordenadas>({
		lat: 0,
		lng: 0,
	});
	const [pesquisaMapa, setPesquisaMapa] = useState<string>("");

	redirecionarAutenticacao();

	const getEstados = async () => {
		await fetchEstados().then((res) => {
			const estados = res.data;

			const opcoesEstados: Opcao[] = [];
			estados
				.filter((e) => RegExp(pesquisaEstado, "i").test(e.nome))
				.sort((a, b) => (a.nome > b.nome ? 1 : -1))
				.map((e) => {
					opcoesEstados.push({
						label: e.nome,
						valor: e.nome,
					});
				});

			setEstados(opcoesEstados);
		});
	};

	const getMunicipios = async () => {
		const estado = watch("endereco.estado");

		if (estado) {
			const sigla = getSiglaFromEstado(estado);

			await fetchMunicipios(sigla).then((res) => {
				const municipios = res.data;

				const opcoesMunicipios: Opcao[] = [];

				municipios
					.filter((m) => RegExp(pesquisaMunicipio, "i").test(m.nome))
					.sort((a, b) => (a.nome > b.nome ? 1 : -1))
					.map((m) => {
						opcoesMunicipios.push({
							label: m.nome,
							valor: m.nome,
						});
					});

				setMunicipios(opcoesMunicipios);
			});
		}
	};

	const onChangeCep = async (cep: string) => {
		clearErrors("endereco.cep");
		cep = cep.replaceAll(/([_-])+/g, "");

		if (cep.length == 8) {
			await getDadosCep(cep).then(async (res) => {
				if (res.data.erro) {
					setError("endereco.cep", { message: "CEP inválido", type: "server" });
				} else {
					const { uf, bairro, localidade, logradouro } = res.data;

					let estado = "";

					await getEstadoFromSigla(uf).then((res) => {
						estado = res.data.nome;
					});

					setValue("endereco.bairro", bairro);
					setValue("endereco.municipio", localidade);
					setValue("endereco.logradouro", logradouro);
					setValue("endereco.estado", estado);
				}
			});
		}
	};

	const onSubmit: SubmitHandler<IFarmacia> = (data) => {
		console.log(data);
	};

	useLayoutEffect(() => {
		getEstados();
	}, []);

	useEffect(() => {
		onChangeCep(watch("endereco.cep"));
	}, [watch("endereco.cep")]);

	useEffect(() => {
		const estado = watch("endereco.estado");

		setPesquisaMapa(estado);

		getMunicipios();

		if (!watch("endereco.cep")) {
			setPesquisaMunicipio("");
			setValue("endereco.municipio", "");
		}
	}, [watch("endereco.estado")]);

	useEffect(() => {
		const municipio = watch("endereco.municipio");

		setPesquisaMunicipio(municipio);
		setPesquisaMapa(municipio);
	}, [watch("endereco.municipio")]);

	useLayoutEffect(() => {
		getEstados();
	}, [pesquisaEstado]);

	useLayoutEffect(() => {
		getMunicipios();
	}, [pesquisaMunicipio]);

	useEffect(() => {
		setValue("endereco.localizacao.x", localizacao.lat);
		setValue("endereco.localizacao.y", localizacao.lng);
	}, [localizacao]);

	return (
		<>
			<Menu />
			<CadastroMain>
				<TituloSecao>CADASTRO DE FARMÁCIA</TituloSecao>
				<CadastroForm onSubmit={handleSubmit(onSubmit)}>
					<CadastroEtapa titulo="Dados da farmácia">
						<CadastroInputs>
							<Controller
								name="cnpj"
								control={control}
								rules={{
									required: {
										message: "CNPJ é obrigatório",
										value: true,
									},
									validate: (v: string) => {
										const cnpj = v.replaceAll(/([/.-])+/g, "");

										if (!validarCNPJ(cnpj)) {
											return "CNPJ inválido";
										}
									},
								}}
								render={({ field }) => {
									return (
										<InputContainer id="cnpj" label="CNPJ" error={errors.cnpj}>
											<InputMascara
												id="cnpj"
												mask="99.999.999/9999-99"
												placeholder="00.000.000/0000-00"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="nome_fantasia"
								control={control}
								rules={{
									required: {
										value: true,
										message: "Nome fantasia é obrigatório",
									},
									minLength: {
										value: 3,
										message: "Nome fantasia não é grande o suficiente",
									},
								}}
								render={({ field }) => {
									return (
										<InputContainer
											id="nome_fantasia"
											label="Nome fantasia"
											error={errors.nome_fantasia}
										>
											<Input
												id="nome_fantasia"
												placeholder="Nome de exibição da farmácia"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<InputContainer id="imagem" label="Imagem">
								<InputImagem
									id="imagem"
									onChange={() => {}}
									titulo="Enviar imagem"
								/>
							</InputContainer>
						</CadastroInputs>
					</CadastroEtapa>
					<CadastroEtapa titulo="Endereço">
						<CadastroInputs>
							<Controller
								name="endereco.cep"
								control={control}
								rules={{
									required: {
										message: "CEP é obrigatório",
										value: true,
									},
									minLength: {
										message: "CEP deve ter 8 digitos",
										value: 9,
									},
								}}
								render={({ field }) => {
									return (
										<InputContainer
											id="cep"
											label="CEP"
											error={errors.endereco && errors.endereco.cep}
										>
											<InputMascara
												mask="99999-999"
												id="cep"
												placeholder="00000-00"
												{...{
													...field,
													ref: null,
												}}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="endereco.estado"
								control={control}
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
											error={errors.endereco && errors.endereco.estado}
										>
											<Select
												id="estado"
												placeholder="Rondônia"
												opcoes={estados}
												filtro={pesquisaEstado}
												setFiltro={setPesquisaEstado}
												setValue={setValue}
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="endereco.municipio"
								control={control}
								rules={{
									required: {
										message: "Municipio é obrigatório",
										value: true,
									},
								}}
								render={({ field }) => {
									return (
										<InputContainer
											id="municipio"
											label="Municipio"
											error={errors.endereco && errors.endereco.municipio}
										>
											<Select
												id="municipio"
												placeholder="Vilhena"
												opcoes={municipios}
												filtro={pesquisaMunicipio}
												disabled={!watch("endereco.estado")}
												setFiltro={setPesquisaMunicipio}
												setValue={setValue}
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="endereco.bairro"
								control={control}
								rules={{
									required: {
										message: "Bairro é obrigatório",
										value: true,
									},
									minLength: {
										message: "Bairro deve ter mais de 3 letras",
										value: 3,
									},
								}}
								render={({ field }) => {
									return (
										<InputContainer
											id="bairro"
											label="Bairro"
											error={errors.endereco && errors.endereco.bairro}
										>
											<Input
												id="bairro"
												placeholder="Ex: Bairro das oliveiras"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="endereco.logradouro"
								control={control}
								rules={{
									required: {
										message: "Logradouro é obrigatório",
										value: true,
									},
									minLength: {
										message: "Logradouro deve ter mais de 3 letras",
										value: 3,
									},
								}}
								render={({ field }) => {
									return (
										<InputContainer
											id="logradouro"
											label="Logradouro"
											error={errors.endereco && errors.endereco.logradouro}
										>
											<Input
												id="logradouro"
												placeholder="Ex: Rua palmeira"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="endereco.numero"
								control={control}
								rules={{
									required: {
										value: true,
										message: "Número é obrigatório",
									},
									pattern: {
										value: /^[0-9]*$/,
										message: "Número inválido",
									},
								}}
								render={({ field }) => {
									return (
										<InputContainer
											id="numero"
											label="Numero"
											error={errors.endereco && errors.endereco.numero}
										>
											<Input
												id="numero"
												placeholder="0000"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
						</CadastroInputs>
						<div className={styles.map_container}>
							<span className={styles.map_title}>
								Selecione a posição no mapa
							</span>
							<div className={styles.map}>
								<Map
									setLocalizacao={setLocalizacao}
									endereco_pesquisa={{
										...watch("endereco"),
										nome_farmacia: watch("nome_fantasia"),
									}}
									map_center={localizacao}
								/>
							</div>
						</div>
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
			</CadastroMain>
		</>
	);
}
