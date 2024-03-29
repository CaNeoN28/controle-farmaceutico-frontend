"use client";

import Menu from "@/components/Menu";
import styles from "./AutoCadastro.module.scss";
import InputImagem from "@/components/InputImagem";
import { ChangeEvent, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IUsuarioAPI, IUsuarioCadastro, IUsuarioPost } from "@/types/Usuario";
import Botao from "@/components/Botao";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";
import InputSenha from "@/components/InputSenha";
import IEntidade from "@/types/Entidades";
import FetchEntidades from "@/fetch/entidades";
import { FiltrosEntidade } from "@/types/fetchEntidades";
import { GetManyRequest, RequestErro } from "@/types/Requests";
import Select, { Opcao } from "@/components/Select";
import FetchAutenticacao from "@/fetch/autenticacao";
import { validarCPF } from "@/utils/validation";
import regexValidation from "@/utils/regexValidation";
import FetchImagem from "@/fetch/imagens";
import { useRouter } from "next/navigation";
import InputMascara from "@/components/InputMascara/indext";

export default function AutoCadastro() {
	const router = useRouter();

	const fetchEntidades = new FetchEntidades().getEntidades;
	const fetchCadastro = new FetchAutenticacao().postCadastro;
	const fetchImagem = new FetchImagem();

	const {
		control,
		formState: { errors: validationErros },
		handleSubmit,
		watch,
		setValue,
		setError,
	} = useForm<IUsuarioCadastro>({
		defaultValues: {
			cpf: "",
			email: "",
			imagem_url: "",
			nome_completo: "",
			nome_usuario: "",
			numero_registro: "",
			senha: "",
			confirmacao_senha: "",
			dados_administrativos: {
				entidade_relacionada: "",
				funcao: "INATIVO",
			},
		},
	});

	const [imagem, setImagem] = useState<File>();
	const [erroImagem, setErroImagem] = useState<string>("");
	const [imagemUrl, setImagemUrl] = useState<string>();

	const [pesquisaEntidade, setPesquisaEntidade] = useState("");
	const [opcoesEntidades, setOpcoes] = useState<Opcao[]>([]);

	const onSubmit: SubmitHandler<IUsuarioPost> = async (data) => {
		let {
			cpf,
			email,
			dados_administrativos,
			imagem_url,
			nome_completo,
			nome_usuario,
			numero_registro,
			senha,
		} = data;

		cpf = cpf.replaceAll(".", "").replaceAll("-", "");

		const usuario = {
			cpf,
			email,
			dados_administrativos,
			imagem_url,
			nome_completo,
			nome_usuario,
			numero_registro,
			senha,
		};

		let erroImagem = "";

		if (imagem) {
			await fetchImagem
				.postImagem(imagem, "usuario")
				.then((res) => {
					const imagens = res.data as { [key: string]: string };

					const imagensArray: string[] = [];

					Object.keys(imagens).map((k: string) => {
						imagensArray.push(imagens[k]);
					});

					usuario.imagem_url = imagensArray[0];
					setErroImagem("");
				})
				.catch((err) => {
					const { response: resposta } = err as RequestErro<{
						mensagem: string;
						erros: {
							[k: string]: string;
						};
					}>;

					erroImagem = "Extensão inválida de arquivo";
					setErroImagem(erroImagem);
				});
		}

		if (!erroImagem) {
			await fetchCadastro(usuario)
				.then((res) => {
					const usuario = res.data as IUsuarioAPI;
					const imagem_url = usuario.imagem_url;
					console.log(usuario);

					if (imagem) {
						fetchImagem
							.confirmarImagem(imagem, "usuario", usuario._id!, imagem_url)
							.then(() => {})
							.catch((err) => {
								console.log(err);
							});
					}

					if (usuario.dados_administrativos.funcao! === "ADMINISTRADOR") {
						router.push("/login")
					} else {
						router.push(`/cadastro-finalizado`);
					}
				})
				.catch((err: RequestErro<{ [key: string]: string }>) => {
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

	const sendImage = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;

		if (files && files.length && FileReader) {
			const reader = new FileReader();

			reader.onload = function () {
				setImagemUrl(reader.result as string);
			};

			reader.readAsDataURL(files[0]);

			setImagem(files[0]);
		} else if (!files || !files.length) {
			setImagem(undefined);
			setImagemUrl("");
		}
	};

	const getEntidades = () => {
		const filtros: FiltrosEntidade = {
			nome_entidade: pesquisaEntidade,
		};

		fetchEntidades(filtros).then((res) => {
			const resposta = res.data as GetManyRequest<IEntidade[]>;
			const entidades = resposta.dados;

			const opcoes: Opcao[] = [];

			entidades.map((e) => {
				opcoes.push({
					label: e.nome_entidade,
					valor: e._id,
				});
			});

			setOpcoes(opcoes);
		});
	};

	useEffect(() => {
		getEntidades();
	}, []);

	useEffect(() => {
		getEntidades();
	}, [pesquisaEntidade]);

	return (
		<>
			<title>Cadastro</title>
			<Menu />
			<main className={styles.main}>
				<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.cadastro}>
						<div className={styles.form_inputs}>
							<Controller
								name="dados_administrativos.entidade_relacionada"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer
											id="entidade_relacionada"
											label="Entidade relacionada"
											error={
												validationErros.dados_administrativos &&
												validationErros.dados_administrativos
													.entidade_relacionada
											}
										>
											<Select
												filtro={pesquisaEntidade}
												opcoes={opcoesEntidades}
												setFiltro={setPesquisaEntidade}
												setValue={setValue}
												placeholder="Selecione a entidade que você está vinculado"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="numero_registro"
								control={control}
								rules={{
									validate: (v: string) => {
										const isNumber = !isNaN(Number(v));

										if (!isNumber) return "Deve ser um atríbuto numérico";
									},
									required: {
										message: "Número de registro é obrigatório",
										value: true,
									},
								}}
								render={({ field }) => {
									return (
										<InputContainer
											id="numero_registro"
											label="Número de registro"
											error={validationErros.numero_registro}
										>
											<Input
												id="numero_registro"
												placeholder="Informe seu número de registro na entidade"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="nome_completo"
								control={control}
								rules={{
									required: {
										value: true,
										message: "Nome completo é obrigatório",
									},
									minLength: {
										message: "Nome deve possuir pelo menos 3 caractéres",
										value: 3,
									},
								}}
								render={({ field }) => {
									return (
										<InputContainer
											id="nome_completo"
											label="Nome completo"
											error={validationErros.nome_completo}
										>
											<Input
												id="nome_completo"
												placeholder="Nome completo com pelo menos 3 letras"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="nome_usuario"
								control={control}
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
											label="Nome de usuário"
											error={validationErros.nome_usuario}
										>
											<Input
												id="nome_usuario"
												placeholder="Nome a ser utilizado na plataforma"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="email"
								control={control}
								rules={{
									required: {
										message: "Email é obrigatório",
										value: true,
									},
									pattern: {
										value: regexValidation.EMAIL,
										message: "Email inválido",
									},
								}}
								render={({ field }) => {
									return (
										<InputContainer
											id="email"
											label="Email"
											error={validationErros.email}
										>
											<Input
												id="email"
												placeholder="Email pessoal ou de serviço"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="cpf"
								control={control}
								rules={{
									required: {
										value: true,
										message: "CPF é obrigatório",
									},
									validate: (v: string) => {
										const cpf = v.replaceAll(".", "").replaceAll("-", "");
										const cpfValido = validarCPF(cpf);

										if (!cpfValido) {
											return "CPF inválido";
										}
									},
								}}
								render={({ field }) => {
									return (
										<InputContainer
											id="cpf"
											label="CPF"
											error={validationErros.cpf}
										>
											<InputMascara
												mask="999.999.999-99"
												id="cpf"
												placeholder="Ex: 000.000.000-00"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="senha"
								control={control}
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
										<InputContainer
											id="senha"
											label="Senha"
											error={validationErros.senha}
										>
											<InputSenha
												id="senha"
												placeholder="Senha a ser utilizada na plataforma"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="confirmacao_senha"
								control={control}
								rules={{
									required: {
										message: "Senha de confirmação é obrigatória",
										value: true,
									},
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
											error={validationErros.confirmacao_senha}
										>
											<InputSenha
												id="confirmacao_senha"
												placeholder="Confirme a senha digitada anteriormente"
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
								<div className={styles.input_imagem}>
									<InputImagem
										id="foto_perfil_input"
										titulo="Enviar imagem"
										onChange={sendImage}
									/>
									{erroImagem && (
										<span className={styles.erro_imagem}>{erroImagem}</span>
									)}
								</div>
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
