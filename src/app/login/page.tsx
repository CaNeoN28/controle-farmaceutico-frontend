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
import { register } from "module";

interface ILogin {
	nome_usuario: string;
	senha: string;
}

export default function Login() {
	const { control, handleSubmit } = useForm<ILogin>({
		defaultValues: {
			nome_usuario: "",
			senha: ""
		}
	});

	const [width, setWidth] = useState(window.innerWidth);

	const classesContainer = classNames({
		[styles.container]: true,
		["box-shadow"]: width > 480,
	});

	const onSubmit: SubmitHandler<ILogin> = (data) => {
		console.log(data);
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
							render={({ field }) => (
								<InputContainer id="nome_usuario" label="Nome de usuário:">
									<Input {...{ ...field, ref: null }} id="nome_usuario" />
								</InputContainer>
							)}
						/>
						<Controller
							name="senha"
							control={control}
							render={({ field }) => (
								<InputContainer id="senha" label="Senha:">
									<InputSenha {...{ ...field, ref: null }} id="senha" />
								</InputContainer>
							)}
						/>
					</div>
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
