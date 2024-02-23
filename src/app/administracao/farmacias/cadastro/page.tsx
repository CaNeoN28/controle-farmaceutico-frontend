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
import { CadastroMain } from "@/components/Cadastro";

export default function CadastroFarmacia() {
	const { handleSubmit, control } = useForm<Farmacia>();

	redirecionarAutenticacao();

	const onSubmit: SubmitHandler<Farmacia> = (data) => {
		console.log(data);
	};

	return (
		<>
			<Menu />
			<CadastroMain>
				<TituloSecao>CADASTRO DE FARMÁCIA</TituloSecao>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					<div className={styles.secao}>
						<span className={styles.titulo_secao}>Dados da farmácia</span>
						<div className={styles.inputs_secao}>
							<Controller
								name="cnpj"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer id="cnpj" label="CNPJ">
											<InputMascara
												id="cnpj"
												mask="99.999.999/9999-99"
												placeholder="00.000.000/0000.00"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="nome_fantasia"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer id="nome_fantasia" label="Nome fantasia">
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
						</div>
					</div>
					<div className={styles.botoes}>
						<Botao fullWidth type="submit">
							Salvar
						</Botao>
						<Botao fullWidth secundario>
							Cancelar
						</Botao>
					</div>
				</form>
			</CadastroMain>
		</>
	);
}
