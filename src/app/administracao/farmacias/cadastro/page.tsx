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
import { FieldError } from "react-hook-form";

export default function CadastroFarmacia() {
	const getPerfil = new FetchAutenticacao().getPerfil;

	const router = useRouter();

	const fetchImagem = new FetchImagem();
	const postFarmacia = new FetchFarmacia().postFarmacia;
	const deleteImagem = new FetchImagem().removeImagem;

	const [imagem, setImagem] = useState<File>();
	const [erroImagem, setErroImagem] = useState<FieldError>();

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
		let erroImagem = "";

		if (imagem) {
			await fetchImagem
				.postImagem(imagem, "farmacia")
				.then((res) => {
					const imagens = res.data as { [key: string]: string };

					const imagensArray: string[] = [];

					Object.keys(imagens).map((k: string) => {
						imagensArray.push(imagens[k]);
					});

					farmacia.imagem_url = imagensArray[0];
					erroImagem = "";
				})
				.catch((err) => {
					erroImagem = "Extensão inválida de arquivo";

					setErroImagem({
						type: "validate",
						message: erroImagem,
					});
				});
		}

		if (!erroImagem) {
			await postFarmacia(farmacia, token)
				.then((res) => {
					const farmacia = res.data as IFarmacia;

					if (imagem && farmacia.imagem_url)
						fetchImagem
							.confirmarImagem(
								imagem,
								"farmacia",
								farmacia._id,
								farmacia.imagem_url
							)
							.then(() => {})
							.catch(() => {});
					setErro(undefined);
					setMensagem("Farmácia cadastrada com sucesso");
					setShowAlert(true);
				})

				.catch((err: RequestErro<any>) => {
					const {
						response: { data },
					} = err;

					if (typeof data === "string") {
						setErro(data);
					} else {
						setErro("Não foi possível cadastrar farmácia");
						console.error(err.response);
					}

					setShowAlert(true);
				});
		}
	};

	useEffect(() => {
		getUsuario();
	}, []);

	useEffect(() => {
		setErroImagem(undefined);
	}, [imagem]);

	if (usuario)
		return (
			<>
				<Menu />
				<CadastroMain>
					<TituloSecao>CADASTRO DE FARMÁCIA</TituloSecao>
					<FormularioFarmacia
						erroImagem={erroImagem}
						setImagem={setImagem}
						salvarFarmacia={salvarFarmacia}
					/>
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
											router.back();
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
											router.back();
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
