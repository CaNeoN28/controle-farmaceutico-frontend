"use client";

import Menu from "@/components/Menu";
import styles from "./Perfil.module.scss";
import { CadastroBotoes } from "@/components/Cadastro";
import { ChangeEventHandler, useEffect, useState } from "react";
import IUsuarioGet, {
	IUsuarioAPI,
	IUsuarioCadastro,
	IUsuarioPut,
} from "@/types/Usuario";
import FetchAutenticacao from "@/fetch/autenticacao";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import {
	Controller,
	SubmitHandler,
	useForm,
} from "react-hook-form";
import { FaUser } from "react-icons/fa";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";
import InputMascara from "@/components/InputMascara/indext";
import InputSenha from "@/components/InputSenha";
import Botao from "@/components/Botao";
import InputImagem from "@/components/InputImagem";
import regexValidation from "@/utils/regexValidation";
import FetchImagem from "@/fetch/imagens";
import { RequestErro } from "@/types/Requests";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function Perfil() {
	const router = useRouter();

	const fAuth = new FetchAutenticacao();
	const fImagens = new FetchImagem();

	const {
		control,
		formState: { errors },
		watch,
		setValue,
		setError,
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

	const [imagem, setImagem] = useState<File>();
	const [localImageUrl, setLocalImageUrl] = useState("");
	const [erroImagem, setErroImagem] = useState("");

	const [usuario, setUsuario] = useState<IUsuarioGet>();
	const [token, setToken] = useState<string>();

	const [editar, setEditar] = useState(false);

	function atribuirUsuario() {
		if (usuario) {
			setValue("nome_completo", usuario.nome_completo);
			setValue("cpf", usuario.cpf);
			setValue("numero_registro", usuario.numero_registro);
			setValue("nome_usuario", usuario.nome_usuario);
			setValue("email", usuario.email);
			setValue("imagem_url", usuario.imagem_url || "");
		}
	}

	function cancelarEdicao() {
		setLocalImageUrl("");
		setErroImagem("");
		setEditar(false);
		setImagem(undefined);

		getUsuario();
		clearErrors();
	}

	const getImagem: ChangeEventHandler<HTMLInputElement> = function (e) {
		const { files } = e.target;

		if (files && files.length && FileReader) {
			const reader = new FileReader();

			reader.onload = function () {
				setLocalImageUrl(reader.result as string);
			};

			reader.readAsDataURL(files[0]);

			setImagem(files[0]);
		} else if (!files || !files.length) {
			setImagem(undefined);
			setLocalImageUrl("");
		}
	};

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

	const onUpdate: SubmitHandler<IUsuarioCadastro> = async function (data) {
		let urlImagemVelha = data.imagem_url;
		let urlImagemNova = "";
		let erroImagem = "";

		if (imagem) {
			await fImagens
				.postImagem(imagem, "usuario")
				.then((res) => {
					const imagens = res.data as { [key: string]: string };

					const imagem = Object.keys(imagens).map((k) => {
						return imagens[k];
					})[0];

					urlImagemNova = imagem;
					setErroImagem("");
				})
				.catch((err) => {
					const { response: resposta } = err as RequestErro<{
						mensagem: string;
						erros: {
							[k: string]: string;
						};
					}>;

					if (resposta) {
						console.log(resposta);
						const { erros } = resposta.data;

						if (erros) {
							const erro = Object.keys(erros).map((k) => erros[k])[0];
							erroImagem = erro;
							setErroImagem(erro);
						}
					}
				});
		}

		if (!erroImagem) {
			const usuario: IUsuarioPut = {
				email: data.email,
				nome_usuario: data.nome_usuario,
			};

			if (urlImagemNova) {
				usuario.imagem_url = urlImagemNova;
			}

			if (data.senha) {
				usuario.senha = data.senha;
			}

			await fAuth
				.updatePerfil(usuario, token)
				.then((res) => {
					const usuario = res.data as IUsuarioAPI;

					if (urlImagemNova && imagem) {
						if (urlImagemVelha) {
							fImagens
								.removeImagem("usuario", usuario._id!, urlImagemVelha, token)
								.then(() => {})
								.catch(() => {});
						}

						fImagens.confirmarImagem(
							imagem,
							"usuario",
							usuario._id!,
							urlImagemNova
						);
					}

					cancelarEdicao();
				})
				.catch((err) => {
					const resposta = err.response;

					if (resposta) {
						const erro = resposta.data;

						Object.keys(erro).map((k) => {
							const key = k as keyof IUsuarioCadastro;

							setError(key, { message: erro[key], type: "server" });
						});
					}
				});
		}
	};

	useEffect(() => {
		getUsuario();
	}, []);

	useEffect(() => {
		setErroImagem("");
	}, [imagem]);

	useEffect(() => {
		atribuirUsuario();
	}, [usuario]);

	if (usuario)
		return (
			<>
				<title>Perfil</title>
				<Menu />
				<main className={styles.main}>
					<form onSubmit={handleSubmit(onUpdate)}>
						<div className={styles.container}>
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
													mask="999.999.999-99"
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
										{usuario.imagem_url || localImageUrl ? (
											<img
												src={
													localImageUrl ||
													`${API_URL}/imagem/${usuario.imagem_url}`
												}
											/>
										) : (
											<div className={styles.placeholder}>
												<FaUser />
											</div>
										)}
									</div>
									{editar && (
										<div className={styles.input_imagem}>
											<InputImagem
												id="foto_perfil_input"
												onChange={getImagem}
												titulo="Enviar imagem"
											/>
											{erroImagem && (
												<span className={styles.erro_imagem}>{erroImagem}</span>
											)}
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
						</div>
					</form>
				</main>
			</>
		);

	return <></>;
}
