"use client";

import InputContainer from "@/components/InputContainer";
import styles from "./Login.module.scss";
import Menu from "@/components/Menu";
import Input from "@/components/Input";
import InputSenha from "@/components/InputSenha";
import Botao from "@/components/Botao";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import FetchAutenticacao from "@/fetch/autenticacao";
import { RequestErro } from "@/types/Requests";
import { ILogin, ILoginResponse } from "@/types/Autenticacao";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Login() {
	const fetchLogin = new FetchAutenticacao().postLogin;
	const router = useRouter();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ILogin>({
		defaultValues: {
			nome_usuario: "",
			senha: "",
		},
	});

	const [width, setWidth] = useState(window.innerWidth);
	const [erro, setErro] = useState("");

	const classesContainer = classNames({
		[styles.container]: true,
		["box-shadow"]: width > 480,
	});

	const onSubmit: SubmitHandler<ILogin> = (data) => {
		const { nome_usuario, senha } = data;

		fetchLogin({ nome_usuario, senha })
			.then((res) => {
				const response = res.data as ILoginResponse;
				const { token } = response;

				setCookie("authentication", token);

				router.push("/administracao");
			})
			.catch((err: RequestErro<string>) => {
				const mensagem = err.response.data;

				setErro(mensagem);
			});
	};

	useEffect(() => {
		const getWidth = () => {
			const { innerWidth } = window;

			setWidth(innerWidth);
		};

		window.addEventListener("resize", getWidth);

		return () => {
			window.removeEventListener("resize", getWidth);
		};
	}, []);

	return (
		<>
			<Menu />
			<main className={styles.main}>
				<form onSubmit={handleSubmit(onSubmit)} className={classesContainer}>
					<span className={styles.titulo}>LOGIN</span>
					<div className={styles.form}>
						<Controller
							name="nome_usuario"
							control={control}
							rules={{
								required: {
									message: "Nome de usuário é obrigatório",
									value: true,
								},
							}}
							render={({ field }) => (
								<InputContainer
									id="nome_usuario"
									label="Nome de usuário:"
									error={errors.nome_usuario}
								>
									<Input {...{ ...field, ref: null }} id="nome_usuario" />
								</InputContainer>
							)}
						/>
						<Controller
							name="senha"
							control={control}
							rules={{
								required: {
									message: "Senha é obrigatório",
									value: true,
								},
							}}
							render={({ field }) => (
								<InputContainer id="senha" label="Senha:" error={errors.senha}>
									<InputSenha {...{ ...field, ref: null }} id="senha" />
								</InputContainer>
							)}
						/>
					</div>
					{erro && <span className={styles.erro}>{erro}</span>}
					<div className={styles.botoes}>
						<Botao fullWidth>Login</Botao>
						<Botao fullWidth secundario>
							Esqueci a senha
						</Botao>
					</div>
				</form>
			</main>
		</>
	);
}
