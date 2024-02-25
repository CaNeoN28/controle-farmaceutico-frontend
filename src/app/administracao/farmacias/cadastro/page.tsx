"use client";

import { FaPlus } from "react-icons/fa";
import Botao from "@/components/Botao";
import styles from "./CadastroFarmacia.module.scss";
import Menu from "@/components/Menu";
import TituloSecao from "@/components/TituloSecao";
import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";
import {
	Controller,
	FieldError,
	SubmitHandler,
	useForm,
} from "react-hook-form";
import IFarmacia, { IHorarioDia, IHorário } from "@/types/Farmacia";
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
import Secao from "@/components/Secao";
import HorariosServico from "../horarios-servico";

export default function CadastroFarmacia() {
	const {
		formState: { errors: errorsFarmacia },
		control: controlFarmacia,
		handleSubmit: handleSubmitFarmacia,
		watch: watchFarmacia,
		setError: setErrorFarmacia,
		setValue: setValueFarmacia,
		clearErrors: clearErrorsFarmacia,
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

	const [horario, setHorario] = useState<{
		[key: string]: IHorário;
	}>({});
	const [errosHorario, setErrosHorario] = useState<{
		dia_semana?: FieldError;
		horario_entrada?: FieldError;
		horario_saida?: FieldError;
	}>({});

	const [pesquisaEstado, setPesquisaEstado] = useState("");
	const [estados, setEstados] = useState<Opcao[]>([]);

	const [pesquisaMunicipio, setPesquisaMunicipio] = useState("");
	const [municipios, setMunicipios] = useState<Opcao[]>([]);

	const [localizacao, setLocalizacao] = useState<Coordenadas>({
		lat: 0,
		lng: 0,
	});

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
		const estado = watchFarmacia("endereco.estado");

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
		clearErrorsFarmacia("endereco.cep");
		cep = cep.replaceAll(/([_-])+/g, "");

		if (cep.length == 8) {
			await getDadosCep(cep).then(async (res) => {
				if (res.data.erro) {
					setErrorFarmacia("endereco.cep", {
						message: "CEP inválido",
						type: "server",
					});
				} else {
					const { uf, bairro, localidade, logradouro } = res.data;

					let estado = "";

					await getEstadoFromSigla(uf).then((res) => {
						estado = res.data.nome;
					});

					setValueFarmacia("endereco.bairro", bairro);
					setValueFarmacia("endereco.municipio", localidade);
					setValueFarmacia("endereco.logradouro", logradouro);
					setValueFarmacia("endereco.estado", estado);
				}
			});
		}
	};

	const onSubmitFarmacia: SubmitHandler<IFarmacia> = (data) => {
		console.log(data);
	};

	const onSubmitHorario = ({
		dia_semana,
		horario_entrada,
		horario_saida,
	}: IHorarioDia) => {
		const erros: string[] = [];

		if (!dia_semana) {
			erros.push("dia_semana:Dia da semana é obrigatório");
		}

		if (!horario_entrada) {
			erros.push("horario_entrada:Horário de entrada é obrigatório");
		}

		if (!horario_saida) {
			erros.push("horario_saida:Horário de saída é obrigatório");
		}

		if (erros.length > 0) {
			const erroObject: any = {};

			erros.map((e) => {
				const [campo, valor] = e.split(":");

				erroObject[campo] = {
					message: valor,
				};
			});

			setErrosHorario(erroObject);

			return false;
		}
		setHorario({
			...horario,
			[dia_semana]: {
				horario_entrada,
				horario_saida,
			},
		});

		setErrosHorario({});
		return true;
	};

	useLayoutEffect(() => {
		getEstados();
	}, []);

	useEffect(() => {
		onChangeCep(watchFarmacia("endereco.cep"));
	}, [watchFarmacia("endereco.cep")]);

	useEffect(() => {
		getMunicipios();

		if (!watchFarmacia("endereco.cep")) {
			setPesquisaMunicipio("");
			setValueFarmacia("endereco.municipio", "");
		}
	}, [watchFarmacia("endereco.estado")]);

	useEffect(() => {
		const municipio = watchFarmacia("endereco.municipio");

		setPesquisaMunicipio(municipio);
	}, [watchFarmacia("endereco.municipio")]);

	useLayoutEffect(() => {
		getEstados();
	}, [pesquisaEstado]);

	useLayoutEffect(() => {
		getMunicipios();
	}, [pesquisaMunicipio]);

	useEffect(() => {
		setValueFarmacia("endereco.localizacao.x", localizacao.lat);
		setValueFarmacia("endereco.localizacao.y", localizacao.lng);
	}, [localizacao]);

	return (
		<>
			<Menu />
			<CadastroMain>
				<TituloSecao>CADASTRO DE FARMÁCIA</TituloSecao>
				<CadastroForm onSubmit={handleSubmitFarmacia(onSubmitFarmacia)}>
					<CadastroEtapa titulo="Dados da farmácia">
						<CadastroInputs>
							<Controller
								name="cnpj"
								control={controlFarmacia}
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
										<InputContainer
											id="cnpj"
											label="CNPJ"
											error={errorsFarmacia.cnpj}
										>
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
								control={controlFarmacia}
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
											error={errorsFarmacia.nome_fantasia}
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
								control={controlFarmacia}
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
											error={
												errorsFarmacia.endereco && errorsFarmacia.endereco.cep
											}
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
								control={controlFarmacia}
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
											error={
												errorsFarmacia.endereco &&
												errorsFarmacia.endereco.estado
											}
										>
											<Select
												id="estado"
												placeholder="Rondônia"
												opcoes={estados}
												filtro={pesquisaEstado}
												setFiltro={setPesquisaEstado}
												setValue={setValueFarmacia}
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="endereco.municipio"
								control={controlFarmacia}
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
											error={
												errorsFarmacia.endereco &&
												errorsFarmacia.endereco.municipio
											}
										>
											<Select
												id="municipio"
												placeholder="Vilhena"
												opcoes={municipios}
												filtro={pesquisaMunicipio}
												disabled={!watchFarmacia("endereco.estado")}
												setFiltro={setPesquisaMunicipio}
												setValue={setValueFarmacia}
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="endereco.bairro"
								control={controlFarmacia}
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
											error={
												errorsFarmacia.endereco &&
												errorsFarmacia.endereco.bairro
											}
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
								control={controlFarmacia}
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
											error={
												errorsFarmacia.endereco &&
												errorsFarmacia.endereco.logradouro
											}
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
								control={controlFarmacia}
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
											error={
												errorsFarmacia.endereco &&
												errorsFarmacia.endereco.numero
											}
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
										...watchFarmacia("endereco"),
										nome_farmacia: watchFarmacia("nome_fantasia"),
									}}
									map_center={localizacao}
								/>
							</div>
						</div>
					</CadastroEtapa>
					<Secao titulo="Horários de serviço">
						<HorariosServico
							horario={horario}
							errosHorario={errosHorario}
							setHorario={setHorario}
							setErros={setErrosHorario}
							onSubmitHorario={onSubmitHorario}
						/>
					</Secao>
					<Secao titulo="Escala de plantão"></Secao>
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
