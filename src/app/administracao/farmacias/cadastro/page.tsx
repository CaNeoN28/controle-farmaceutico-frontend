"use client";

import styles from "./CadastroFarmacia.module.scss";
import IFarmacia from "@/types/Farmacia";
import FormularioFarmacia from "../formulario";
import FetchFarmacia from "@/fetch/farmacias";
import { deleteCookie, getCookie } from "cookies-next";
import Alert from "@/components/Alert";
import { useEffect, useState } from "react";
import { RequestErro } from "@/types/Requests";
import Botao from "@/components/Botao";
import { useRouter } from "next/navigation";
import Menu from "@/components/Menu";
import { CadastroMain } from "@/components/Cadastro";
import TituloSecao from "@/components/TituloSecao";
import FetchImagem from "@/fetch/imagens";
import FetchAutenticacao from "@/fetch/autenticacao";
import { IUsuarioAPI } from "@/types/Usuario";

export default function CadastroFarmacia() {
	const getPerfil = new FetchAutenticacao().getPerfil;

	const router = useRouter();
	const postFarmacia = new FetchFarmacia().postFarmacia;
	const deleteImagem = new FetchImagem().removeImagem;

	const [showAlert, setShowAlert] = useState(false);
	const [erro, setErro] = useState<string>();
	const [mensagem, setMensagem] = useState<string>();

	const [usuario, setUsuario] = useState<IUsuarioAPI>();
	const [token, setToken] = useState<string>();

	async function getUsuario() {
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

	const salvarFarmacia = async (farmacia: IFarmacia) => {
		const urlImagem = farmacia.imagem_url;

		await postFarmacia(farmacia, token)
			.then((res) => {
				setErro(undefined);
				setMensagem("Farmácia cadastrada com sucesso");
				setShowAlert(true);
			})

			.catch((err: RequestErro<any>) => {
				const {
					response: { data },
				} = err;

				if (urlImagem) {
					deleteImagem(urlImagem).then().catch();
				}

				if (typeof data === "string") {
					setErro(data);
				} else {
					setErro("Não foi possível cadastrar farmácia");
					console.error(err.response);
				}

				setShowAlert(true);
			});
	};

	useEffect(() => {
		getUsuario();
	}, []);

	if (usuario)
		return (
			<>
				<Menu />
				<CadastroMain>
					<TituloSecao>CADASTRO DE FARMÁCIA</TituloSecao>
					<FormularioFarmacia salvarFarmacia={salvarFarmacia} />
				</CadastroMain>
				<Alert
					show={showAlert}
					onClickBackground={() => {
						if (erro) {
							setShowAlert(false);
						} else if (mensagem) {
							setShowAlert(false);
							router.push("/administracao");
						}
					}}
				>
					<div className={styles.alert}>
						<span className={styles.alert_texto}>{erro || mensagem}</span>
						<div className={styles.alert_opcoes}>
							{erro ? (
								<>
									<Botao
										fullWidth
										onClick={() => {
											setShowAlert(false);
										}}
									>
										Continuar
									</Botao>
									<Botao
										secundario
										fullWidth
										onClick={() => {
											router.push("/administracao");
										}}
									>
										Cancelar
									</Botao>
								</>
							) : (
								<>
									<Botao
										fullWidth
										onClick={() => {
											router.push("/administracao/farmacias");
										}}
									>
										Confirmar
									</Botao>
								</>
							)}
						</div>
					</div>
				</Alert>
			</>
		);

	return <></>;
}
