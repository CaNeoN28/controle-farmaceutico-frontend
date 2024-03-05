"use client";

import styles from "./EditarFarmacia.module.scss";
import IFarmacia from "@/types/Farmacia";
import FormularioFarmacia from "../../formulario";
import FetchFarmacia from "@/fetch/farmacias";
import { deleteCookie, getCookie } from "cookies-next";
import Alert from "@/components/Alert";
import { useEffect, useState } from "react";
import { RequestErro } from "@/types/Requests";
import Botao from "@/components/Botao";
import { useRouter } from "next/navigation";
import Carregando from "@/components/Carregando";
import Menu from "@/components/Menu";
import { CadastroMain } from "@/components/Cadastro";
import TituloSecao from "@/components/TituloSecao";
import FetchImagem from "@/fetch/imagens";
import FetchAutenticacao from "@/fetch/autenticacao";
import { IUsuarioAPI } from "@/types/Usuario";
import { FieldError } from "react-hook-form";

interface Params {
	id: string;
}

export default function EditarFarmacia({
	params: { id: id_farmacia },
}: {
	params: Params;
}) {
	const router = useRouter();

	const getPerfil = new FetchAutenticacao().getPerfil;
	const fetchFarmacia = new FetchFarmacia();
	const fetchImagem = new FetchImagem();

	const date = new Date();

	const [imagem, setImagem] = useState<File>();
	const [erroImagem, setErroImagem] = useState<FieldError>();

	const [farmacia, setFarmacia] = useState<IFarmacia>();
	const [showAlert, setShowAlert] = useState(false);
	const [erro, setErro] = useState<string>();
	const [erroEdicao, setErroEdicao] = useState<string>();
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

	const getFarmacia = async () => {
		await fetchFarmacia
			.getFarmacia(id_farmacia)
			.then((res) => {
				const farmacia = res.data as IFarmacia;

				farmacia.plantoes = farmacia.plantoes
					.filter((p) => {
						return Number(new Date(p.saida)) >= Number(date);
					})
					.sort((a, b) => {
						return new Date(a.entrada) > new Date(b.entrada) ? 1 : -1;
					});

				setFarmacia(farmacia);
			})
			.catch((err) => {
				setErro("Farmácia não encontrada");
			});
	};

	const salvarFarmacia = async (data: IFarmacia) => {
		let urlImagemNova = "";
		let urlImagemVelha = farmacia?.imagem_url;
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

					urlImagemNova = imagensArray[0];
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
			if (urlImagemNova) {
				data.imagem_url = urlImagemNova;
			}

			await fetchFarmacia
				.updateFarmacia(data, id_farmacia, token)
				.then(async (res) => {
					const farmacia = res.data as IFarmacia;

					if (urlImagemNova && imagem) {
						if (urlImagemVelha) {
							await fetchImagem
								.removeImagem("farmacia", farmacia._id, urlImagemVelha, token)
								.then(() => {})
								.catch(() => {});
						}

						await fetchImagem
							.confirmarImagem(imagem, "farmacia", farmacia._id, urlImagemNova)
							.then(() => {})
							.catch(() => {});
					}

					setErroEdicao(undefined);
					setMensagem("Farmácia atualizada com sucesso");
					setShowAlert(true);
				})

				.catch((err: RequestErro<any>) => {
					const {
						response: { data },
					} = err;

					if (typeof data === "string") {
						setErroEdicao(data);
					} else {
						setErroEdicao("Não foi possível atualizar farmácia");
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
		getFarmacia();
	}, [token]);

	if (usuario)
		return (
			<>
				<title>Editar farmácia</title>
				<Menu />
				{farmacia ? (
					<CadastroMain>
						<TituloSecao>EDIÇÃO DE FARMÁCIA</TituloSecao>
						<FormularioFarmacia
							salvarFarmacia={salvarFarmacia}
							setImagem={setImagem}
							erroImagem={erroImagem}
							farmacia={farmacia}
							horariosAntigos={farmacia.horarios_servico}
							plantoesAntigos={farmacia.plantoes}
						/>
					</CadastroMain>
				) : erro ? (
					<div className={styles.erro}>{erro}</div>
				) : (
					<Carregando />
				)}
				<Alert
					show={showAlert}
					onClickBackground={() => {
						if (erro) {
							setShowAlert(false);
						} else if (mensagem) {
							setShowAlert(false);
							router.back();
						}
					}}
				>
					<div className={styles.alert}>
						<span className={styles.alert_texto}>{erroEdicao || mensagem}</span>
						<div className={styles.alert_opcoes}>
							{erroEdicao ? (
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
