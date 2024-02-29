"use client";

import Menu from "@/components/Menu";
import styles from "./EditarEntidade.module.scss";
import FormularioEntidade from "../../formulario";
import { CadastroMain } from "@/components/Cadastro";
import TituloSecao from "@/components/TituloSecao";
import IEntidade from "@/types/Entidades";
import { useEffect, useState } from "react";
import FetchEntidades from "@/fetch/entidades";
import { IUsuarioAPI } from "@/types/Usuario";
import { deleteCookie, getCookie } from "cookies-next";
import FetchAutenticacao from "@/fetch/autenticacao";
import { useRouter } from "next/navigation";
import Carregando from "@/components/Carregando";

interface Params {
	id: string;
}

export default function EditarEntidade({
	params: { id: id_entidade },
}: {
	params: Params;
}) {
	const router = useRouter();

	const getPerfil = new FetchAutenticacao().getPerfil;
	const fEntidades = new FetchEntidades();

	const [entidade, setEntidade] = useState<IEntidade>();
	const [erroEntidade, setErroEntidade] = useState("");

	const [usuario, setUsuario] = useState<IUsuarioAPI>();
	const [token, setToken] = useState<string>();

	async function enviarEntidade(data: IEntidade) {}

	async function getEntidade() {
		await fEntidades
			.getEntidade(id_entidade)
			.then((res) => {
				const entidade = res.data;

				setEntidade(entidade);
			})
			.catch(() => {
				setErroEntidade("Entidade não encontrada")
			});
	}

	async function getToken() {
		const token = getCookie("authentication");

		await getPerfil(token)
			.then((res) => {
				const usuario = res.data;

				setUsuario(usuario);
				setToken(token);
			})
			.catch(() => {
				deleteCookie("authentication");
				router.push("/login");
			});
	}

	useEffect(() => {
		getToken();
		getEntidade();
	}, []);

	if (usuario)
		return (
			<>
				<Menu />
				{entidade ? (
					<CadastroMain>
						<TituloSecao>EDITAR ENTIDADE</TituloSecao>
						<FormularioEntidade
							entidade={entidade}
							enviarEntidade={enviarEntidade}
						/>
					</CadastroMain>
				) : erroEntidade ? (
					<div className={styles.erro}>{erroEntidade}</div>
				) : (
					<Carregando />
				)}
			</>
		);

	return <></>;
}
