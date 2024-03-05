"use client";

import { useRouter } from "next/navigation";
import styles from "./EditarUsuario.module.scss";
import FetchAutenticacao from "@/fetch/autenticacao";
import FetchImagem from "@/fetch/imagens";
import { deleteCookie, getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import IUsuarioGet, { IUsuarioAPI } from "@/types/Usuario";
import { getUsuario, putUsuario } from "@/fetch/usuarios";
import Menu from "@/components/Menu";
import Carregando from "@/components/Carregando";
import { CadastroMain } from "@/components/Cadastro";
import TituloSecao from "@/components/TituloSecao";
import FormularioUsuario from "../../formulario";
import { FieldError } from "react-hook-form";
import FetchEntidades from "@/fetch/entidades";
import IEntidade from "@/types/Entidades";
import Alert from "@/components/Alert";
import Botao from "@/components/Botao";

interface Params {
	id: string;
}

export default function EditarUsuario({ params }: { params: Params }) {
	const { id: id_usuario } = params;

	const router = useRouter();

	const getPerfil = new FetchAutenticacao().getPerfil;
	const fetchImagem = new FetchImagem();

	const [token, setToken] = useState<string>();
	const [usuarioLogado, setUsuarioLogado] = useState<IUsuarioAPI>();

	const [imagem, setImagem] = useState<File>();
	const [erroImagem, setErroImagem] = useState<FieldError>();

	const [nomeEntidade, setNomeEntidade] = useState("");
	const [usuario, setUsuario] = useState<IUsuarioAPI>();
	const [erros, setErros] = useState<{ [key: string]: FieldError }>({});

	const [mensagemEdicao, setMensagemEdicao] = useState("");
	const [erro, setErro] = useState("");
	const [erroEdicao, setErroEdicao] = useState("");

	async function getUsuarioLogado() {
		const token = getCookie("authentication");

		await getPerfil(token)
			.then((res) => {
				const usuario = res.data;

				setUsuarioLogado(usuario);
				setToken(token);
			})
			.catch(() => {
				deleteCookie("authentication");
				router.push("/login");
			});
	}

	async function getUsuarioEdicao() {
		await getUsuario(id_usuario, token)
			.then((res) => {
				const usuario = res.data as IUsuarioGet;
				const entidade = usuario.dados_administrativos.entidade_relacionada;

				setNomeEntidade(entidade.nome_entidade);
				setUsuario({
					...usuario,
					dados_administrativos: {
						entidade_relacionada: entidade._id,
						funcao: usuario.dados_administrativos.funcao,
					},
				});
			})
			.catch(() => {
				setErro("Usuário não foi encontrado");
			});
	}

	async function fetchUsuario(data: IUsuarioAPI) {
		let erroImagem = "";
		let urlImagemNova = "";
		let urlImagemVelha = usuario?.imagem_url;

		if (imagem) {
			await fetchImagem
				.postImagem(imagem, "usuario")
				.then((res) => {
					urlImagemNova = Object.keys(res.data).map((k) => {
						const imagem = res.data[k];

						return imagem;
					})[0];

					data.imagem_url = urlImagemNova;
				})
				.catch((err) => {
					erroImagem = "Arquivo inválido";

					setErroImagem({
						type: "validate",
						message: erroImagem,
					});
				});
		}

		if (!erroImagem) {
			await putUsuario(id_usuario, data, token)
				.then(async (res) => {
					const usuario = res.data as IUsuarioAPI;

					if (urlImagemNova && imagem) {
						if (urlImagemVelha) {
							await fetchImagem
								.removeImagem("usuario", usuario._id!, urlImagemVelha, token)
								.then(() => {})
								.catch(() => {});
						}

						await fetchImagem
							.confirmarImagem(imagem, "usuario", usuario._id!, urlImagemNova)
							.then(() => {})
							.catch(() => {});
					}

					setMensagemEdicao("Usuário alterado com sucesso");
				})
				.catch((err) => {
					const data = err.response.data;
					const erros: { [key: string]: FieldError } = {};

					Object.keys(data).map((k) => {
						if (!erros[k]) {
							erros[k] = {
								message: data[k],
								type: "validate",
							};
						}
					});

					if (Object.keys(erros).length == 0)
						setErroEdicao("Não foi possível editar o usuário");

					setErros(erros);
				});
		}
	}

	useEffect(() => {
		getUsuarioLogado();
	}, []);

	useEffect(() => {
		getUsuarioEdicao();
	}, [token]);

	if (usuarioLogado) {
		return (
			<>
				<title>Editar usuário</title>
				<Menu />
				{usuario ? (
					<CadastroMain>
						<TituloSecao>EDIÇÃO DE USUÁRIO</TituloSecao>
						<FormularioUsuario
							fetchUsuario={fetchUsuario}
							setImagem={setImagem}
							usuarioEditor={usuario}
							erroImagem={erroImagem}
							usuarioData={usuario}
							nome_entidade={nomeEntidade}
							erros={erros}
						/>
					</CadastroMain>
				) : erro ? (
					<div className={styles.erro}>{erro}</div>
				) : (
					<Carregando />
				)}
				<Alert
					show={!!erroEdicao}
					onClickBackground={() => {
						setErroEdicao("");
						router.push("/administracao/usuarios");
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
							<Botao
								fullWidth
								secundario
								onClick={() => {
									setErroEdicao("");
									router.push("/administracao/usuarios");
								}}
							>
								Cancelar
							</Botao>
						</div>
					</div>
				</Alert>
				<Alert
					show={!!mensagemEdicao}
					onClickBackground={() => {
						setMensagemEdicao("");
						router.push("/administracao/usuarios");
					}}
				>
					<div className={styles.alert}>
						<span className={styles.alert_texto}>{mensagemEdicao}</span>
						<Botao
							fullWidth
							onClick={() => {
								setMensagemEdicao("");
								router.push("/administracao/usuarios");
							}}
						>
							Confirmar
						</Botao>
					</div>
				</Alert>
			</>
		);
	}

	return <></>;
}
