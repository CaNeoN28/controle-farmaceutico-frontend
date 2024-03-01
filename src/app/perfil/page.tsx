"use client";

import Menu from "@/components/Menu";
import styles from "./Perfil.module.scss";
import { CadastroContainer } from "@/components/Cadastro";
import { useEffect, useState } from "react";
import IUsuarioGet, { IUsuarioAPI } from "@/types/Usuario";
import FetchAutenticacao from "@/fetch/autenticacao";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Perfil() {
	const router = useRouter();

	const fAuth = new FetchAutenticacao();

	const [usuario, setUsuario] = useState<IUsuarioGet>();
	const [token, setToken] = useState<string>();

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

	useEffect(() => {
		getUsuario();
	}, []);

	if (usuario)
		return (
			<>
				<Menu />
				<main className={styles.main}>
					<CadastroContainer></CadastroContainer>
				</main>
			</>
		);

	return <></>;
}
