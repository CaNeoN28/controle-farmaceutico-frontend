"use client";

import Botao from "@/components/Botao";
import styles from "./CadastroFarmacia.module.scss";
import Menu from "@/components/Menu";
import TituloSecao from "@/components/TituloSecao";
import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Farmacia from "@/types/Farmacia";
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

export default function CadastroFarmacia() {
	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<Farmacia>();

	redirecionarAutenticacao();

	const onSubmit: SubmitHandler<Farmacia> = (data) => {
		console.log(data);
	};

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
