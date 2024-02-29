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
import { useRouter } from "next/navigation";
import FetchEntidades from "@/fetch/entidades";
import Alert from "@/components/Alert";
import Botao from "@/components/Botao";

export default function CadastroEntidades() {
	const router = useRouter();

	const fAuth = new FetchAutenticacao();
	const fEntidades = new FetchEntidades().postEntidade;

	const [usuario, setUsuario] = useState<IUsuarioAPI>();
	const [token, setToken] = useState<string>();

	const [mensagemCadastro, setMensagemCadastro] = useState("");
	const [mensagemErro, setMensagemErro] = useState("");

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
				deleteCookie("authentication");
				router.push("/login");
			});
	};

	async function enviarEntidade(data: IEntidade) {
		await fEntidades(data, token)
			.then((res) => {
				setMensagemCadastro("Entidade cadastrada com sucesso");
			})
			.catch((err) => {
				console.log(err);
				setMensagemErro("Não foi possível cadastrar entidade");
			});
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
				<Alert
					show={!!mensagemCadastro}
					onClickBackground={() => {
						setMensagemCadastro("");
						router.back();
					}}
				>
					<div className={styles.alert}>
						<span className={styles.alert_texto}>{mensagemCadastro}</span>
						<Botao
							fullWidth
							onClick={() => {
								setMensagemCadastro("");
								router.back();
							}}
						>
							Confirmar
						</Botao>
					</div>
				</Alert>
				<Alert
					show={!!mensagemErro}
					onClickBackground={() => {
						setMensagemErro("");
					}}
				>
					<div className={styles.alert}>
						<span className={styles.alert_texto}>{mensagemErro}</span>
						<div className={styles.alert_opcoes}>
							<Botao
								fullWidth
								onClick={() => {
									setMensagemErro("");
								}}
							>
								Continuar
							</Botao>
							<Botao
								secundario
								fullWidth
								onClick={() => {
									setMensagemErro("");
									router.back();
								}}
							>
								Cancelar
							</Botao>
						</div>
					</div>
				</Alert>
			</>
		);

	return <></>;
}
