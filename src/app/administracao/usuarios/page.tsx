"use client";
import styles from "./UsuariosAdministracao.module.scss";
import Menu from "@/components/Menu";
import {
	AdministracaoConfirmarFiltros,
	AdministracaoContainer,
	AdministracaoFiltros,
	AdministracaoItem,
	AdministracaoListagem,
	AdministracaoMain,
} from "@/components/Administracao";
import TituloSecao from "@/components/TituloSecao";
import { useEffect, useState } from "react";
import IUsuarioGet, { Funcao, IUsuarioAPI } from "@/types/Usuario";
import { deleteUsuario, getUsuarios } from "@/fetch/usuarios";
import { GetManyRequest } from "@/types/Requests";
import { deleteCookie, getCookie } from "cookies-next";
import FetchAutenticacao from "@/fetch/autenticacao";
import { mascararCPF } from "@/utils/mascaras";
import verificarPermissao from "@/utils/verificarPermissao";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { addSearchParam } from "@/utils/navigation";
import Paginacao from "@/components/Paginacao";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";
import Select, { Opcao } from "@/components/Select";
import FetchEntidades from "@/fetch/entidades";
import IEntidade from "@/types/Entidades";
import Alert from "@/components/Alert";
import Botao from "@/components/Botao";

interface Filtros {
	pagina?: number;
	limite?: number;
	nome_usuario?: string;
	entidade_relacionada?: string;
	funcao?: Funcao | "";
}

export default function UsuariosAdministracao() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const getPerfil = new FetchAutenticacao().getPerfil;
	const fEntidades = new FetchEntidades();

	const { pagina, entidade_relacionada, funcao, nome_usuario }: Filtros = {
		pagina: Number(searchParams.get("pagina")) || 1,
		entidade_relacionada: searchParams.get("entidade_relacionada") || "",
		nome_usuario: searchParams.get("nome_usuario") || "",
		funcao: searchParams.get("funcao") as Funcao || "",
	};

	const { control, handleSubmit, watch, setValue } = useForm<Filtros>({
		defaultValues: {
			entidade_relacionada,
			funcao,
			nome_usuario,
		},
	});

	const [usuario, setUsuario] = useState<IUsuarioAPI>();
	const [token, setToken] = useState<string>();

	const [usuarios, setUsuarios] = useState<IUsuarioGet[]>([]);
	const [usuarioParaRemover, setUsuarioParaRemover] = useState<IUsuarioGet>();
	const [erroAoRemover, setErroAoRemover] = useState("");
	const [mensagemRemocao, setMensagemRemocao] = useState("");

	const [funcoes, setFuncoes] = useState<Opcao[]>([]);
	const [filtroFuncao, setFiltroFuncao] = useState<string>(funcao || "");

	const [entidades, setEntidades] = useState<Opcao[]>([]);
	const [filtroEntidade, setFiltroEntidade] = useState<string>("");

	const [params, setParams] = useState<URLSearchParams>(searchParams);
	const [maxPaginas, setMaxPaginas] = useState<number>(5);

	const getFuncoes = () => {
		const funcoes: Funcao[] = [
			"ADMINISTRADOR",
			"GERENTE",
			"USUARIO",
			"INATIVO",
		];

		const fFuncoes: Opcao[] = funcoes
			.filter((f) => new RegExp(filtroFuncao, "i").test(f))
			.map((f) => {
				return {
					label: f,
					valor: f,
				};
			});

		setFuncoes(fFuncoes);
	};

	const getEntidades = async () => {
		await fEntidades
			.getEntidades({ nome_entidade: filtroEntidade })
			.then((res) => {
				const { dados } = res.data as GetManyRequest<IEntidade[]>;

				const opcoes: Opcao[] = dados.map((d) => {
					return {
						label: d.nome_entidade,
						valor: d._id,
					};
				});

				setEntidades(opcoes);
			})
			.catch();
	};

	const onFiltro: SubmitHandler<Filtros> = function (data) {
		const params = new URLSearchParams(searchParams);

		Object.keys(data).map((k) => {
			const key = k as keyof Filtros;
			const value = String(data[key]);

			if (value) {
				params.set(key, value);
			} else {
				params.delete(key);
			}
		});

		setParams(params);
	};

	const getEntidade = async () => {
		if (entidade_relacionada) {
			await fEntidades
				.getEntidade(entidade_relacionada)
				.then((res) => {
					const entidade = res.data as IEntidade;

					setFiltroEntidade(entidade.nome_entidade);
				})
				.catch(() => {
					setValue("entidade_relacionada", "");
				});
		}
	};

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

	const onCleanFiltro = () => {
		const newParams = new URLSearchParams();
		const dados = watch();

		Object.keys(dados).map((k) => {
			const key = k as keyof Filtros;

			setValue(key, "");
			newParams.delete(key);
		});

		setFiltroEntidade("");
		setFiltroFuncao("");
		setParams(newParams), router.replace(`${pathname}`);
	};

	const fetchUsuarios = async () => {
		const { pagina, entidade_relacionada, funcao, nome_usuario }: Filtros = {
			pagina: Number(params.get("pagina")) || 1,
			entidade_relacionada: params.get("entidade_relacionada") || "",
			nome_usuario: params.get("nome_usuario") || "",
			funcao: params.get("funcao") as Funcao,
		};

		const filtros: Filtros = {
			pagina,
			entidade_relacionada,
			funcao,
			nome_usuario,
			limite: 10,
		};

		if (usuario && token)
			await getUsuarios(filtros, token)
				.then((res) => {
					const { dados, paginas_totais, documentos_totais } =
						res.data as GetManyRequest<IUsuarioGet[]>;

					if (dados.length == 0) {
						if (documentos_totais != 0) {
							addSearchParam("pagina", "1", searchParams, setParams);
						} else {
							setMaxPaginas(0);
						}
					}

					setMaxPaginas(paginas_totais);
					setUsuarios(dados);
				})
				.catch((err) => {
					console.log(err);
				});
	};

	const removerUsuario = async () => {
		if (usuarioParaRemover && token) {
			await deleteUsuario(usuarioParaRemover._id!, token)
				.then((res) => {
					setMensagemRemocao("Usuário removido com sucesso");
					setErroAoRemover("");
				})
				.catch((err) => {
					const { data } = err.response;
					setErroAoRemover(`Erro: ${data}`);
				});

			setUsuarioParaRemover(undefined);
			fetchUsuarios();
		}
	};

	useEffect(() => {
		getUsuario();
		getEntidade();
	}, []);

	useEffect(() => {
		getFuncoes();
	}, [filtroFuncao]);

	useEffect(() => {
		getEntidades();
	}, [filtroEntidade]);

	useEffect(() => {
		fetchUsuarios();
	}, [pagina]);

	useEffect(() => {
		fetchUsuarios();
	}, [params]);

	useEffect(() => {
		if (params) {
			router.replace(`${pathname}?${params}`);
		}
	}, [params]);

	useEffect(() => {
		if (token) fetchUsuarios();
	}, [token]);

	if (usuario)
		return (
			<>
				<Menu />
				<AdministracaoMain>
					<TituloSecao>LISTAGEM DE USUÁRIOS</TituloSecao>
					<AdministracaoContainer>
						<AdministracaoFiltros onSubmit={handleSubmit(onFiltro)}>
							<Controller
								name="nome_usuario"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer id="nome_usuario" label="Nome de usuario">
											<Input
												id="nome_usuario"
												placeholder="Nome do usuário na plataforma"
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								control={control}
								name="funcao"
								render={({ field }) => {
									return (
										<InputContainer id="funcao" label="Função administrativa">
											<Select
												id="funcao"
												placeholder="USUARIO"
												opcoes={funcoes}
												filtro={filtroFuncao}
												setFiltro={setFiltroFuncao}
												setValue={setValue}
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								control={control}
								name="entidade_relacionada"
								render={({ field }) => {
									return (
										<InputContainer
											id="entidade_relacionada"
											label="Entidade relacionada"
										>
											<Select
												id="entidade_relacionada"
												placeholder="Ministério da Saúde"
												opcoes={entidades}
												filtro={filtroEntidade}
												setFiltro={setFiltroEntidade}
												setValue={setValue}
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<AdministracaoConfirmarFiltros onClean={onCleanFiltro} />
						</AdministracaoFiltros>
						{usuarios.length > 0 && (
							<AdministracaoListagem>
								{usuarios.map((f, i) => {
									const funcaoUsuarioE = usuario.dados_administrativos.funcao!;
									const funcaoUsuario = f.dados_administrativos.funcao!;

									const conteudoPrincipal = (
										<>
											<span>
												{f.nome_completo} ({f.nome_usuario})
											</span>
											<span>{mascararCPF(f.cpf)}</span>
										</>
									);

									const conteudoSecundario = (
										<>
											<span>{f.dados_administrativos.funcao} ({f.dados_administrativos.entidade_relacionada.nome_entidade})</span>
											<span>{f.email}</span>
										</>
									);

									return (
										<AdministracaoItem
											id={f._id}
											key={i}
											onDelete={() => {
												setUsuarioParaRemover(f);
											}}
											tipo="usuario"
											conteudoPrincipal={conteudoPrincipal}
											conteudoSecundario={conteudoSecundario}
											imagem_url={f.imagem_url}
											linkEditar={`/administracao/usuarios/editar/${f._id}`}
											podeAlterar={
												verificarPermissao(funcaoUsuarioE, "GERENTE") &&
												verificarPermissao(funcaoUsuarioE, funcaoUsuario)
											}
										/>
									);
								})}
							</AdministracaoListagem>
						)}
					</AdministracaoContainer>
					{maxPaginas > 0 && (
						<Paginacao
							pagina={pagina}
							paginaMax={maxPaginas}
							setPagina={(v) => {
								addSearchParam("pagina", v.toString(), searchParams, setParams);
							}}
						/>
					)}
				</AdministracaoMain>
				<Alert
					show={!!usuarioParaRemover}
					onClickBackground={() => {
						setUsuarioParaRemover(undefined);
					}}
				>
					<div className={styles.alert}>
						<span>
							Deseja remover o usuário {usuarioParaRemover?.nome_usuario}?
						</span>
						<div className={styles.alert_botoes}>
							<Botao
								fullWidth
								onClick={() => {
									removerUsuario();
								}}
							>
								Confirmar
							</Botao>
							<Botao
								fullWidth
								secundario
								onClick={() => {
									setUsuarioParaRemover(undefined);
								}}
							>
								Cancelar
							</Botao>
						</div>
					</div>
				</Alert>
				<Alert
					show={!!erroAoRemover}
					onClickBackground={() => {
						setErroAoRemover("");
					}}
				>
					<div className={styles.alert}>
						<span>{erroAoRemover}</span>
						<Botao
							fullWidth
							onClick={() => {
								setErroAoRemover("");
							}}
						>
							Confirmar
						</Botao>
					</div>
				</Alert>
				<Alert
					show={!!mensagemRemocao}
					onClickBackground={() => {
						setMensagemRemocao("");
					}}
				>
					<div className={styles.alert}>
						<span>{mensagemRemocao}</span>
						<Botao
							fullWidth
							onClick={() => {
								setMensagemRemocao("");
							}}
						>
							Confirmar
						</Botao>
					</div>
				</Alert>
			</>
		);

	return <></>;
}
