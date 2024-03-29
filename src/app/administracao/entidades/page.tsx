"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./EntidadesAdministracao.module.scss";
import FetchEntidades from "@/fetch/entidades";
import { useEffect, useState } from "react";
import { GetManyRequest } from "@/types/Requests";
import IEntidade from "@/types/Entidades";
import { addSearchParam } from "@/utils/navigation";
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
import Paginacao from "@/components/Paginacao";
import { IUsuarioAPI } from "@/types/Usuario";
import FetchAutenticacao from "@/fetch/autenticacao";
import { deleteCookie, getCookie } from "cookies-next";
import verificarPermissao from "@/utils/verificarPermissao";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";
import Select, { Opcao } from "@/components/Select";
import {
	getOpcoesFromEstados,
	getOpcoesFromMunicipios,
} from "@/utils/getOpcoesSelect";
import municipioExiste from "@/utils/municipioExiste";
import { limparFiltros } from "@/utils/filtros";
import Alert from "@/components/Alert";
import Botao from "@/components/Botao";

interface Filtros {
	pagina?: number;
	limite?: number;
	nome_entidade?: string;
	estado?: string;
	municipio?: string;
	ativo: "SIM" | "NAO" | "TODOS";
}

export default function EntidadesAdministracao() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const getPerfil = new FetchAutenticacao().getPerfil;
	const fEntidades = new FetchEntidades();

	const { estado, municipio, nome_entidade, pagina, ativo }: Filtros = {
		pagina: Number(searchParams.get("pagina")) || 1,
		estado: searchParams.get("estado") || "",
		municipio: searchParams.get("municipio") || "",
		nome_entidade: searchParams.get("nome_entidade") || "",
		ativo: (searchParams.get("ativo") as "SIM" | "NAO" | "TODOS") || "SIM",
	};

	const { control, watch, handleSubmit, setValue } = useForm<Filtros>({
		defaultValues: {
			estado: estado || "",
			municipio: municipio || "",
			nome_entidade: nome_entidade || "",
			ativo: ativo || "SIM",
		},
	});

	const [params, setParams] = useState<URLSearchParams>(searchParams);
	const [maxPaginas, setMaxPaginas] = useState(5);

	const [estados, setEstados] = useState<Opcao[]>([]);
	const [filtroEstado, setFiltroEstado] = useState(estado);

	const [municipios, setMunicipios] = useState<Opcao[]>([]);
	const [filtroMunicipio, setFiltroMunicipio] = useState(municipio);

	const [opcoesAtivo] = useState<Opcao[]>([
		{ label: "SIM", valor: "SIM" },
		{ label: "NAO", valor: "NAO" },
		{ label: "TODOS", valor: "TODOS" },
	]);
	const [opcaoAtivo, setOpcaoAtivo] = useState(ativo);

	const [entidades, setEntidades] = useState<IEntidade[]>([]);

	const [entidadeParaRemover, setEntidadeRemover] = useState<IEntidade>();
	const [mensagemRemocao, setMensagemRemocao] = useState("");
	const [erroRemocao, setErroRemocao] = useState("");

	const [usuario, setUsuario] = useState<IUsuarioAPI>();
	const [token, setToken] = useState<string>();

	const applyFiltros: SubmitHandler<Filtros> = function (data) {
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

		params.set("pagina", "1");
		setParams(params);
	};

	function getMunicipios() {
		const estado = watch("estado");

		if (estado) {
			getOpcoesFromMunicipios(estado, filtroMunicipio, setMunicipios);
		}
	}

	function getEstados() {
		getOpcoesFromEstados(filtroEstado, setEstados);
	}

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

	async function removerEntidade() {
		if (entidadeParaRemover)
			await fEntidades
				.deleteEntidade(entidadeParaRemover._id, token)
				.then((res) => {
					setMensagemRemocao("Entidade removida com sucesso");
					getEntidades();
				})
				.catch((err) => {
					const data = err.response.data;

					setErroRemocao(`Erro: ${data}`);
				});
	}

	async function getEntidades() {
		const { estado, nome_entidade, municipio, ativo }: Filtros = {
			estado: params.get("estado") || "",
			municipio: params.get("municipio") || "",
			nome_entidade: params.get("nome_entidade") || "",
			ativo: (params.get("ativo") as "SIM" | "NAO" | "TODOS") || "SIM",
		};

		const filtros: Filtros = {
			estado,
			municipio,
			nome_entidade,
			ativo,
			limite: 10,
			pagina,
		};

		await fEntidades.getEntidades(filtros).then((res) => {
			const { dados, documentos_totais, paginas_totais } =
				res.data as GetManyRequest<IEntidade[]>;

			if (dados.length == 0) {
				if (documentos_totais != 0) {
					addSearchParam("pagina", "1", searchParams, setParams);
				} else {
					setMaxPaginas(0);
				}
			}

			setEntidades(dados);
			setMaxPaginas(paginas_totais);
		});
	}

	useEffect(() => {
		getUsuario();
	}, []);

	useEffect(() => {
		getMunicipios();
	}, [filtroMunicipio]);

	useEffect(() => {
		getEstados();
	}, [filtroEstado]);

	useEffect(() => {
		const ativo = watch("ativo");
		setOpcaoAtivo(ativo);
	}, [watch("ativo")]);

	useEffect(() => {
		const estado = watch("estado");
		const municipio = watch("municipio");

		if (!estado) {
			setValue("municipio", "");
			setFiltroMunicipio("");
		} else {
			if (municipio) {
				municipioExiste(estado, municipio).then((res) => {
					if (!res) {
						setValue("municipio", "");
						setFiltroMunicipio("");
					}
				});
			}
		}

		setFiltroEstado(estado || "");
		getMunicipios();
	}, [watch("estado")]);

	useEffect(() => {
		getEntidades();
	}, [pagina]);

	useEffect(() => {
		getEntidades();
	}, [params]);

	useEffect(() => {
		if (params) {
			router.replace(`${pathname}?${params}`);
		}
	}, [params]);

	if (usuario)
		return (
			<>
				<title>Administração de entidades</title>
				<Menu />
				<AdministracaoMain>
					<TituloSecao>LISTAGEM DE ENTIDADES</TituloSecao>
					<AdministracaoContainer>
						<AdministracaoFiltros onSubmit={handleSubmit(applyFiltros)}>
							<Controller
								control={control}
								name="nome_entidade"
								render={({ field }) => {
									return (
										<InputContainer id="nome_entidade" label="Nome da entidade">
											<Input id="nome_entidade" {...{ ...field, ref: null }} />
										</InputContainer>
									);
								}}
							/>
							<Controller
								control={control}
								name="estado"
								render={({ field }) => {
									return (
										<InputContainer id="estado" label="Estado">
											<Select
												filtro={filtroEstado}
												opcoes={estados}
												placeholder="Rondônia"
												setFiltro={setFiltroEstado}
												setValue={setValue}
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								control={control}
								name="municipio"
								render={({ field }) => {
									return (
										<InputContainer id="municipio" label="Município">
											<Select
												disabled={!watch("estado")}
												filtro={filtroMunicipio}
												opcoes={municipios}
												placeholder="Vilhena"
												setFiltro={setFiltroMunicipio}
												setValue={setValue}
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<Controller
								control={control}
								name="ativo"
								render={({ field }) => {
									return (
										<InputContainer id="ativo" label="Ativo?">
											<Select
												filtro={opcaoAtivo}
												placeholder="SIM"
												opcoes={opcoesAtivo}
												setFiltro={() => {}}
												setValue={setValue}
												{...{
													...field,
													ref: null,
												}}
											/>
										</InputContainer>
									);
								}}
							/>
							<AdministracaoConfirmarFiltros
								onClean={limparFiltros({
									router,
									pathname,
									setParams,
									setValue,
									watch,
								})}
							/>
						</AdministracaoFiltros>
						{entidades.length > 0 && (
							<AdministracaoListagem>
								{entidades.map((e, i) => {
									return (
										<AdministracaoItem
											id={e._id}
											key={i}
											conteudoPrincipal={<span>{e.nome_entidade}</span>}
											conteudoSecundario={
												<>
													<span>{e.municipio}</span>
													<span>{e.estado}</span>
												</>
											}
											onDelete={() => {
												setEntidadeRemover(e);
											}}
											linkEditar={`/administracao/entidades/editar/${e._id}`}
											podeAlterar={verificarPermissao(
												usuario.dados_administrativos.funcao!,
												"GERENTE"
											)}
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
					show={!!entidadeParaRemover}
					onClickBackground={() => {
						setEntidadeRemover(undefined);
					}}
				>
					<div className={styles.alert}>
						<span>
							Deseja remover a entidade {entidadeParaRemover?.nome_entidade}?
						</span>
						<div className={styles.alert_botoes}>
							<Botao fullWidth onClick={removerEntidade}>
								Confirmar
							</Botao>
							<Botao
								fullWidth
								secundario
								onClick={() => {
									setEntidadeRemover(undefined);
								}}
							>
								Cancelar
							</Botao>
						</div>
					</div>
				</Alert>
				<Alert
					show={!!mensagemRemocao}
					onClickBackground={() => setMensagemRemocao("")}
				>
					<div className={styles.alert}>
						<span>{mensagemRemocao}</span>
						<div className={styles.alert_botoes}>
							<Botao fullWidth onClick={() => setMensagemRemocao("")}>
								Continuar
							</Botao>
						</div>
					</div>
				</Alert>
				<Alert
					show={!!erroRemocao}
					onClickBackground={() => setErroRemocao("")}
				>
					<div className={styles.alert}>
						<span>{erroRemocao}</span>
						<div className={styles.alert_botoes}>
							<Botao fullWidth onClick={() => setErroRemocao("")}>
								Continuar
							</Botao>
						</div>
					</div>
				</Alert>
			</>
		);

	return <></>;
}
