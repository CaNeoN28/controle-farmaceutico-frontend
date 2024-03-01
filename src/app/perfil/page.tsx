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

export default function Perfil() {
	const router = useRouter();

	const fAuth = new FetchAutenticacao();

	const {
		control,
		formState: { errors },
		watch,
		setValue,
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
				console.log(usuario);

				setUsuario(usuario);
				setToken(token);
			})
			.catch(() => {
				deleteCookie("authentication");
				router.push("/login");
			});
	}

	const onUpdate: SubmitHandler<IUsuarioCadastro> = async function (data) {
		console.log(data);
	};

	useEffect(() => {
		getUsuario();
	}, []);

	useEffect(() => {
		if (usuario) {
			setValue("nome_completo", usuario.nome_completo);
			setValue("cpf", usuario.cpf);
			setValue("numero_registro", usuario.numero_registro);
			setValue("nome_usuario", usuario.nome_usuario);
			setValue("email", usuario.email);
		}
	}, [usuario]);

	if (usuario)
		return (
			<>
				<Menu />
				<main className={styles.main}>
					<CadastroContainer>
						<div className={styles.dados_fixos}>
							<Controller
								control={control}
								name="nome_completo"
								disabled
								render={({ field }) => {
									return (
										<InputContainer id="nome_completo" label="Nome completo">
											<Input id="nome_completo" {...{ ...field, ref: null }} />
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
								disabled
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
								disabled
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
							<Controller
								control={control}
								name="senha"
								disabled
								render={({ field }) => {
									return (
										<InputContainer
											id="senha"
											label="Senha"
											error={errors.senha}
										>
											<InputSenha id="senha" {...{ ...field, ref: null }} />
										</InputContainer>
									);
								}}
							/>
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
							</div>
						</div>
						<CadastroBotoes>
							<Botao fullWidth>Editar</Botao>
						</CadastroBotoes>
					</CadastroContainer>
				</main>
			</>
		);

	return <></>;
}