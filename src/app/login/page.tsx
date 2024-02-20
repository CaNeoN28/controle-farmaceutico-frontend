"use client";

import InputContainer from "@/components/InputContainer";
import styles from "./Login.module.scss";
import Menu from "@/components/Menu";
import Input from "@/components/Input";
import InputSenha from "@/components/InputSenha";
import Botao from "@/components/Botao";
import classNames from "classnames";
import { useEffect, useState } from "react";

export default function Login() {
	const [width, setWidth] = useState(window.innerWidth);

	const classesContainer = classNames({
		[styles.container]: true,
		["box-shadow"]: width > 480,
	});

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
				<div className={classesContainer}>
					<span className={styles.titulo}>LOGIN</span>
					<form className={styles.form}>
						<InputContainer id="email" label="Email">
							<Input id="email" />
						</InputContainer>
						<InputContainer id="senha" label="Senha">
							<InputSenha id="senha" />
						</InputContainer>
					</form>
					<div className={styles.botoes}>
						<Botao fullWidth>Login</Botao>
						<Botao fullWidth secundario>
							Esqueci a senha
						</Botao>
					</div>
				</div>
			</main>
		</>
	);
}
