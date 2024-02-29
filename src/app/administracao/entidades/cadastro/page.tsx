"use client";

import styles from "./EntidadesCadastro.module.scss";
import { CadastroMain } from "@/components/Cadastro";
import Menu from "@/components/Menu";
import TituloSecao from "@/components/TituloSecao";
import FormularioEntidade from "../formulario";
import IEntidade from "@/types/Entidades";
import { useEffect, useState } from "react";
import { IUsuarioAPI } from "@/types/Usuario";
import FetchAutenticacao from "@/fetch/autenticacao";
import { deleteCookie, getCookie } from "cookies-next";
import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";
import { useRouter } from "next/navigation";

export default function CadastroEntidades() {
	const router = useRouter()

	const fAuth = new FetchAutenticacao();

	const [usuario, setUsuario] = useState<IUsuarioAPI>();
	const [token, setToken] = useState<string>();

	const getToken = async () => {
		const token = getCookie("authentication");

		await fAuth
			.getPerfil(token)
			.then((res) => {
				const usuario = res.data as IUsuarioAPI;

				setToken(token);
				setUsuario(usuario);
			})
			.catch(() => {
				deleteCookie("authentication")
				router.push("/login")
			});
	};

	function enviarEntidade(data: IEntidade) {
		console.log(data);
	}

	useEffect(() => {
		getToken();
	}, []);

	if (usuario)
		return (
			<>
				<Menu />
				<CadastroMain>
					<TituloSecao>CADASTRO DE ENTIDADE</TituloSecao>
					<FormularioEntidade enviarEntidade={enviarEntidade} />
				</CadastroMain>
			</>
		);

	return <></>;
}
