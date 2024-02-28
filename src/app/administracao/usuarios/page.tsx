"use client";

import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";
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
import { Funcao, IUsuarioAPI } from "@/types/Usuario";
import { getUsuarios } from "@/fetch/usuarios";
import { GetManyRequest } from "@/types/Requests";
import { getCookie } from "cookies-next";
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

interface Filtros {
	pagina?: number;
	limite?: number;
	nome_completo?: string;
	entidade_relacionada?: string;
	funcao?: Funcao | "";
}

export default function UsuariosAdministracao() {
	redirecionarAutenticacao();

	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const fAuth = new FetchAutenticacao();
	const fEntidades = new FetchEntidades();

	const { pagina }: Filtros = {
		pagina: Number(searchParams.get("pagina")) || 1,
	};

	const { control, handleSubmit, watch, setValue } = useForm<Filtros>({
		defaultValues: {
			entidade_relacionada: "",
			funcao: "",
			nome_completo: "",
		},
	});

	const [usuario, setUsuario] = useState<IUsuarioAPI>();
	const [token, setToken] = useState("");

	const [usuarios, setUsuarios] = useState<IUsuarioAPI[]>([]);

	const [funcoes, setFuncoes] = useState<Opcao[]>([]);
	const [filtroFuncao, setFiltroFuncao] = useState("");

	const [entidades, setEntidades] = useState<Opcao[]>([]);
	const [filtroEntidade, setFiltroEntidade] = useState("");

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

				setEntidades(opcoes)
			}).catch();
	};

	const onFiltro: SubmitHandler<Filtros> = (data) => {
		console.log(data);
	};

	const getUsuario = async () => {
		const token = getCookie("authentication") || "";

		await fAuth
			.getPerfil(token)
			.then((res) => {
				const usuario = res.data as IUsuarioAPI;

				setUsuario(usuario);
				setToken(token);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const fetchUsuarios = async () => {
		const filtros: Filtros = {
			pagina,
			limite: 10,
		};

		if (usuario)
			await getUsuarios(filtros, token)
				.then((res) => {
					const { dados, paginas_totais, documentos_totais } =
						res.data as GetManyRequest<IUsuarioAPI[]>;

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

	useEffect(() => {
		getUsuario();
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
								name="nome_completo"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer id="nome_completo" label="Nome completo">
											<Input
												id="nome_completo"
												placeholder="Nome completo do usuário"
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
												{...{...field, ref: null}}
											/>
										</InputContainer>
									);
								}}
							/>
							<AdministracaoConfirmarFiltros onClean={() => {}} />
						</AdministracaoFiltros>
						{usuarios.length > 0 && (
							<AdministracaoListagem>
								{usuarios.map((f, i) => {
									const funcaoUsuarioE = usuario.dados_administrativos.funcao!;
									const funcaoUsuario = f.dados_administrativos.funcao!;

									const conteudoPrincipal = (
										<>
											<span>{f.nome_completo}</span>
											<span>{mascararCPF(f.cpf)}</span>
										</>
									);

									const conteudoSecundario = (
										<>
											<span>{f.dados_administrativos.funcao}</span>
											<span>{f.email}</span>
										</>
									);

									return (
										<AdministracaoItem
											id={f._id}
											key={i}
											onDelete={() => {}}
											conteudoPrincipal={conteudoPrincipal}
											conteudoSecundario={conteudoSecundario}
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
			</>
		);

	return <></>;
}
