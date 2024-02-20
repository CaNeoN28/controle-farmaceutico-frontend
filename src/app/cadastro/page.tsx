"use client";

import Menu from "@/components/Menu";
import styles from "./AutoCadastro.module.scss";
import InputImagem from "@/components/InputImagem";
import { ChangeEvent, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IUsuarioCadastro, IUsuarioPost } from "@/types/Usuario";
import Botao from "@/components/Botao";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";
import InputSenha from "@/components/InputSenha";

export default function AutoCadastro() {
	const { control, formState, handleSubmit, watch } = useForm<IUsuarioCadastro>(
		{
			defaultValues: {
				cpf: "",
				email: "",
				imagem_url: "",
				nome_completo: "",
				nome_usuario: "",
				numero_registro: "",
				senha: "",
				confirmacao_senha: "",
			},
		}
	);

	const [imagemUrl, setImagemUrl] = useState<string>();

	const onSubmit: SubmitHandler<IUsuarioPost> = (data) => {
		console.log(data);
	};

	const sendImage = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;

		if (files && files.length && FileReader) {
			const reader = new FileReader();

			reader.onload = function () {
				setImagemUrl(reader.result as string);
			};

			reader.readAsDataURL(files[0]);
		}
	};

	return (
		<>
			<Menu />
			<main className={styles.main}>
				<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.cadastro}>
						<div className={styles.form_inputs}>
							<Controller
								name="numero_registro"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer
											id="numero_registro"
											label="Número de registro"
										>
											<Input
												id="numero_registro"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="nome_completo"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer id="nome_completo" label="Nome completo">
											<Input id="nome_completo" {...{ ...field, ref: null }} />
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="nome_usuario"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer id="nome_usuario" label="Nome de usuário">
											<Input id="nome_usuario" {...{ ...field, ref: null }} />
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="email"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer id="email" label="Email">
											<Input id="email" {...{ ...field, ref: null }} />
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="cpf"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer id="cpf" label="CPF">
											<Input id="cpf" {...{ ...field, ref: null }} />
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="senha"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer id="senha" label="Senha">
											<InputSenha id="senha" {...{ ...field, ref: null }} />
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="confirmacao_senha"
								control={control}
								rules={{
									validate: (v: string) => {
										if (watch("senha") !== v) {
											return "As senhas não correspondem";
										}
									},
								}}
								render={({ field }) => {
									return (
										<InputContainer
											id="confirmacao_senha"
											label="Confirmar senha"
											error={formState.errors.confirmacao_senha}
										>
											<InputSenha
												id="confirmacao_senha"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
						</div>
						<div className={styles.imagem_container}>
							<div className={styles.imagem_form}>
								<div className={styles.imagem}>
									{imagemUrl ? (
										<img src={imagemUrl} />
									) : (
										<div className={styles.placeholder}>
											<FaUser />
										</div>
									)}
								</div>
								<InputImagem
									id="foto_perfil_input"
									titulo="Enviar imagem"
									onChange={sendImage}
								/>
							</div>
						</div>
					</div>
					<div className={styles.form_buttons}>
						<Botao type="submit" fullWidth>
							Enviar
						</Botao>
						<Botao fullWidth secundario>
							Cancelar
						</Botao>
					</div>
				</form>
			</main>
		</>
	);
}
