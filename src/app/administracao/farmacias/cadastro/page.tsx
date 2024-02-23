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
	getDadosCep,
	getEstadoFromSigla,
} from "@/fetch/localizacao";
import Select, { Opcao } from "@/components/Select";

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
			},
		},
	});

	const [pesquisaEstado, setPesquisaEstado] = useState("");
	const [estados, setEstados] = useState<Opcao[]>([]);

	const [pesquisaMunicipio, setPesquisaMunicipio] = useState("");
	const [municipios, setMunicipios] = useState<Opcao[]>([]);

	redirecionarAutenticacao();

	const getEstados = async () => {
		await fetchEstados().then((res) => {
			const estados = res.data;

			const opcoesEstados: Opcao[] = [];
			estados
				.filter((e) => RegExp(pesquisaEstado).test(e.nome))
				.map((e) => {
					opcoesEstados.push({
						label: e.nome,
						valor: e.nome,
					});
				});

			setEstados(opcoesEstados);
		});
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

	useEffect(() => {
		onChangeCep(watch("endereco.cep"));
	}, [watch("endereco.cep")]);

	useEffect(() => {
		setPesquisaEstado(watch("endereco.estado"));
	}, [watch("endereco.estado")]);

	useLayoutEffect(() => {
		getEstados();
	}, []);

	useEffect(() => {
		console.log(estados);
	}, [estados]);

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
											label="Estado"
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
			</CadastroMain>
		</>
	);
}
