"use client";

import Menu from "@/components/Menu";
import styles from "./Perfil.module.scss";
import { CadastroBotoes, CadastroContainer } from "@/components/Cadastro";
import { useEffect, useState } from "react";
import IUsuarioGet, {
	IUsuarioAPI,
	IUsuarioCadastro,
	IUsuarioPost,
} from "@/types/Usuario";
import FetchAutenticacao from "@/fetch/autenticacao";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FaUser } from "react-icons/fa";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";
import InputMascara from "@/components/InputMascara/indext";
import InputSenha from "@/components/InputSenha";
import Botao from "@/components/Botao";
import InputImagem from "@/components/InputImagem";
import regexValidation from "@/utils/regexValidation";

export default function Perfil() {
	const router = useRouter();

	const fAuth = new FetchAutenticacao();

	const {
		control,
		formState: { errors },
		watch,
		setValue,
		clearErrors,
		handleSubmit,
	} = useForm<IUsuarioCadastro>({
		defaultValues: {
			nome_completo: "",
			cpf: "",
			numero_registro: "",
			nome_usuario: "",
			email: "",
			senha: "",
			confirmacao_senha: "",
		},
	});

	const [usuario, setUsuario] = useState<IUsuarioGet>();
	const [token, setToken] = useState<string>();

	const [editar, setEditar] = useState(false);

	async function getUsuario() {
		const token = getCookie("authentication");

		await fAuth
			.getPerfil(token)
			.then((res) => {
				const usuario = res.data as IUsuarioGet;

				setUsuario(usuario);
				setToken(token);
			})
			.catch(() => {
				deleteCookie("authentication");
				router.push("/login");
			});
	}

	async function atribuirUsuario() {
		if (usuario) {
			setValue("nome_completo", usuario.nome_completo);
			setValue("cpf", usuario.cpf);
			setValue("numero_registro", usuario.numero_registro);
			setValue("nome_usuario", usuario.nome_usuario);
			setValue("email", usuario.email);
		}
	}

	async function cancelarEdicao() {
		setEditar(false);

		getUsuario();
		clearErrors();
	}

	const onUpdate: SubmitHandler<IUsuarioCadastro> = async function (data) {
		console.log(data);
	};

	useEffect(() => {
		getUsuario();
	}, []);

	useEffect(() => {
		atribuirUsuario();
	}, [usuario]);

	if (usuario)
		return (
			<>
				<Menu />
				<main className={styles.main}>
					<form onSubmit={handleSubmit(onUpdate)}>
						<CadastroContainer>
							<div className={styles.dados_fixos}>
								<Controller
									control={control}
									name="nome_completo"
									disabled
									render={({ field }) => {
										return (
											<InputContainer id="nome_completo" label="Nome completo">
												<Input
													id="nome_completo"
													{...{ ...field, ref: null }}
												/>
											</InputContainer>
										);
									}}
								/>
								<Controller
									control={control}
									name="cpf"
									disabled
									render={({ field }) => {
										return (
											<InputContainer id="cpf" label="CPF">
												<InputMascara
													mask="000.000.000-00"
													id="cpf"
													{...{ ...field, ref: null }}
												/>
											</InputContainer>
										);
									}}
								/>
								<Controller
									control={control}
									name="numero_registro"
									disabled
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
							</div>
							<div className={styles.dados}>
								<Controller
									control={control}
									name="nome_usuario"
									rules={{
										required: {
											message: "Nome de usuário é obrigatório",
											value: true,
										},
										pattern: {
											message: "Nome de usuário inválido",
											value: regexValidation.NOME_USUARIO,
										},
									}}
									disabled={!editar}
									render={({ field }) => {
										return (
											<InputContainer
												id="nome_usuario"
												label="Nome de usuário"
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
									disabled={!editar}
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
											<InputContainer
												id="email"
												label="Email"
												error={errors.email}
											>
												<Input id="email" {...{ ...field, ref: null }} />
											</InputContainer>
										);
									}}
								/>
								{editar && (
									<>
										<Controller
											control={control}
											name="senha"
											disabled={!editar}
											rules={{
												pattern: {
													message: "Senha de confirmação inválida",
													value: regexValidation.SENHA,
												},
											}}
											render={({ field }) => {
												return (
													<InputContainer
														id="senha"
														label="Senha"
														error={errors.senha}
													>
														<InputSenha
															id="senha"
															{...{ ...field, ref: null }}
														/>
													</InputContainer>
												);
											}}
										/>
										<Controller
											control={control}
											name="confirmacao_senha"
											rules={{
												pattern: {
													message: "Senha de confirmação inválida",
													value: regexValidation.SENHA,
												},
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
														error={errors.confirmacao_senha}
													>
														<InputSenha
															id="confirmacao_senha"
															{...{ ...field, ref: null }}
														/>
													</InputContainer>
												);
											}}
										/>
									</>
								)}
								<div className={styles.imagem_container}>
									<div className={styles.imagem}>
										{usuario.imagem_url ? (
											<img src={usuario.imagem_url} />
										) : (
											<div className={styles.placeholder}>
												<FaUser />
											</div>
										)}
									</div>
									{editar && (
										<div className={styles.input_imagem}>
											<InputImagem onChange={() => {}} titulo="Enviar imagem" />
										</div>
									)}
								</div>
							</div>
							<CadastroBotoes>
								{editar ? (
									<>
										<Botao fullWidth type="submit">
											Salvar
										</Botao>
										<Botao fullWidth secundario onClick={cancelarEdicao}>
											Cancelar
										</Botao>
									</>
								) : (
									<Botao
										fullWidth
										onClick={(e) => {
											e.preventDefault();
											setEditar(true);
										}}
									>
										Editar
									</Botao>
								)}
							</CadastroBotoes>
						</CadastroContainer>
					</form>
				</main>
			</>
		);

	return <></>;
}
