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
import Alert from "@/components/Alert";
import Botao from "@/components/Botao";

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

	const [mensagemEdicao, setMensagemEdicao] = useState("");
	const [erroEdicao, setErroEdicao] = useState("");

	const [usuario, setUsuario] = useState<IUsuarioAPI>();
	const [token, setToken] = useState<string>();

	const redirect = () => {
		setErroEdicao("");
		setMensagemEdicao("");
		router.push("/administracao/entidades");
	};

	async function enviarEntidade(data: IEntidade) {
		await fEntidades
			.putEntidade(id_entidade, data, token)
			.then((res) => {
				setMensagemEdicao("Entidade atualizada com sucesso");
			})
			.catch((err) => {
				console.log(err);
				setErroEdicao("Não foi possível atualizar a entidade");
			});
	}

	async function getEntidade() {
		await fEntidades
			.getEntidade(id_entidade)
			.then((res) => {
				const entidade = res.data;

				setEntidade(entidade);
			})
			.catch(() => {
				setErroEntidade("Entidade não encontrada");
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
				<title>Editar entidade</title>
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
				<Alert show={!!mensagemEdicao} onClickBackground={redirect}>
					<div className={styles.alert}>
						<span className={styles.alert_texto}>{mensagemEdicao}</span>
						<Botao onClick={redirect}>Confirmar</Botao>
					</div>
				</Alert>
				<Alert
					show={!!erroEdicao}
					onClickBackground={() => {
						setErroEdicao("");
					}}
				>
					<div className={styles.alert}>
						<span className={styles.alert_texto}>{erroEdicao}</span>
						<div className={styles.alert_opcoes}>
							<Botao
								fullWidth
								onClick={() => {
									setErroEdicao("");
								}}
							>
								Continuar
							</Botao>
							<Botao fullWidth secundario onClick={redirect}>
								Cancelar
							</Botao>
						</div>
					</div>
				</Alert>
			</>
		);

	return <></>;
}
