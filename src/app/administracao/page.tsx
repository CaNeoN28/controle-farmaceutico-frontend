"use client";

import Menu from "@/components/Menu";
import styles from "./Administracao.module.scss";
import OpcaoAdministrativa from "@/components/OpcaoAdministrativa";
import classNames from "classnames";
import { useEffect, useState } from "react";
import FetchAutenticacao from "@/fetch/autenticacao";
import { IUsuarioAPI } from "@/types/Usuario";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Administracao() {
	const router = useRouter();
	const getPerfil = new FetchAutenticacao().getPerfil;

	const [width, setWidth] = useState(window.innerWidth);
	const [usuario, setUsuario] = useState<IUsuarioAPI>();

	const classesMain = classNames({
		[styles.main]: true,
		["box-shadow"]: width >= 672,
	});

	async function getUsuario() {
		const token = getCookie("authentication");

		await getPerfil(token)
			.then((res) => {
				const usuario = res.data;

				setUsuario(usuario);
			})
			.catch(() => {
				deleteCookie("authentication");
				router.push("/login");
			});
	}

	useEffect(() => {
		getUsuario();
		const getWidth = () => {
			const { innerWidth } = window;

			setWidth(innerWidth);
		};

		window.addEventListener("resize", getWidth);

		return () => {
			window.removeEventListener("resize", getWidth);
		};
	}, []);

	if (usuario)
		return (
			<>
				<title>Administração</title>
				<Menu />
				<main className={classesMain}>
					<div className={styles.opcoes}>
						<div className={styles.conjunto}>
							<OpcaoAdministrativa
								tipo="farmacia"
								url_destino="/administracao/farmacias"
							>
								Listagem de Farmácias
							</OpcaoAdministrativa>
							<OpcaoAdministrativa
								tipo="farmacia"
								url_destino="/administracao/farmacias/cadastro"
							>
								Cadastro de Farmácia
							</OpcaoAdministrativa>
						</div>
						<div className={styles.conjunto}>
							<OpcaoAdministrativa
								tipo="usuario"
								url_destino="/administracao/usuarios"
							>
								Listagem de Usuários
							</OpcaoAdministrativa>
							<OpcaoAdministrativa
								tipo="usuario"
								url_destino="/administracao/usuarios/cadastro"
							>
								Cadastro de Usuário
							</OpcaoAdministrativa>
						</div>
						<div className={styles.conjunto}>
							<OpcaoAdministrativa
								tipo="entidade"
								url_destino="/administracao/entidades"
							>
								Listagem de Entidades
							</OpcaoAdministrativa>
							<OpcaoAdministrativa
								tipo="entidade"
								url_destino="/administracao/entidades/cadastro"
							>
								Cadastro de Entidade
							</OpcaoAdministrativa>
						</div>
					</div>
				</main>
			</>
		);
}
