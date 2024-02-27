"use client";

import Menu from "@/components/Menu";
import styles from "./FarmaciasAdministracao.module.scss";
import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";
import TituloSecao from "@/components/TituloSecao";
import Paginacao from "@/components/Paginacao";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
	AdministracaoConfirmarFiltros,
	AdministracaoContainer,
	AdministracaoFiltros,
	AdministracaoItem,
	AdministracaoListagem,
	AdministracaoMain,
} from "@/components/Administracao";
import IFarmacia from "@/types/Farmacia";
import FetchFarmacia from "@/fetch/farmacias";
import { GetManyRequest } from "@/types/Requests";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Estado } from "@/types/Localizacao";
import { fetchEstados, fetchMunicipios } from "@/fetch/localizacao";
import Select, { Opcao } from "@/components/Select";
import { getSiglaFromEstado } from "@/utils/estadosParaSigla";
import { getCookie } from "cookies-next";
import FetchAutenticacao from "@/fetch/autenticacao";
import Alert from "@/components/Alert";
import Botao from "@/components/Botao";

interface Filtros {
	nome_fantasia?: string;
	municipio?: string;
	estado?: string;
	pagina?: number;
	limite?: number;
}

export default function FarmaciasAdministracao() {
	redirecionarAutenticacao();

	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const fFarmacias = new FetchFarmacia();
	const fAuth = new FetchAutenticacao().getPerfil;

	const { pagina, estado, municipio, nome_fantasia }: Filtros = {
		pagina: Number(searchParams.get("pagina")) || 1,
		estado: searchParams.get("estado") || "",
		municipio: searchParams.get("municipio") || "",
		nome_fantasia: searchParams.get("nome_fantasia") || "",
	};

	const { control, watch, handleSubmit, setValue } = useForm<Filtros>({
		defaultValues: {
			estado,
			municipio,
			nome_fantasia,
		},
	});

	const [estados, setEstados] = useState<Opcao[]>([]);
	const [filtroEstado, setFiltroEstado] = useState(estado);

	const [municipios, setMunicipios] = useState<Opcao[]>([]);
	const [filtroMunicipio, setFiltroMunicipio] = useState(municipio);

	const [params, setParams] = useState<URLSearchParams>(searchParams);
	const [maxPaginas, setMaxPaginas] = useState<number>(5);

	const [farmacias, setFarmacias] = useState<IFarmacia[]>([]);

	const [tokenValido, setTokenValido] = useState("");
	const [farmaciaParaRemover, setFarmaciaParaRemover] = useState<IFarmacia>();
	const [mensagemRemocao, setMensagemRemocao] = useState("");
	const [erroAoRemover, setErroAoRemover] = useState("");

	const getEstados = async () => {
		await fetchEstados()
			.then((res) => {
				const estados = res.data;

				const fEstados: Opcao[] = estados
					.filter((e) => new RegExp(filtroEstado, "i").test(e.nome))
					.sort((a, b) => (a.nome > b.nome ? 1 : -1))
					.map((e) => {
						return {
							label: e.nome,
							valor: e.nome,
						};
					});

				setEstados(fEstados);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getMunicipios = async () => {
		const estado = watch("estado");

		if (estado) {
			const siglaEstado = getSiglaFromEstado(estado);

			await fetchMunicipios(siglaEstado).then((res) => {
				const municipios = res.data;

				const fMunicipios: Opcao[] = municipios
					.filter((m) => new RegExp(filtroMunicipio, "i").test(m.nome))
					.sort((a, b) => (a.nome > b.nome ? 1 : -1))
					.map((m) => {
						return {
							label: m.nome,
							valor: m.nome,
						};
					});

				setMunicipios(fMunicipios);
			});
		}
	};

	const validarToken = async () => {
		const token = getCookie("authentication") || "";

		await fAuth(token)
			.then((res) => {
				setTokenValido(token);
			})
			.catch(() => {});
	};

	const cleanFiltros = () => {
		const newParams = new URLSearchParams();
		const dados = watch();

		Object.keys(dados).map((k) => {
			const key = k as keyof Filtros;

			setValue(key, "");
			newParams.delete(key);
		});

		setParams(newParams);
		router.replace(`${pathname}`);
	};

	const removerFarmacia = async () => {
		if (farmaciaParaRemover && tokenValido) {
			await fFarmacias
				.removeFarmacia(farmaciaParaRemover._id, tokenValido)
				.then((res) => {
					setMensagemRemocao("Farmácia removida com sucesso");
					setErroAoRemover("");
				})
				.catch((err) => {
					const { data } = err.response;
					setErroAoRemover(`Erro: ${data}`);
				});

			setFarmaciaParaRemover(undefined);
			getFarmacias();
		}
	};

	const submitFiltros: SubmitHandler<Filtros> = function (data) {
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

	function addSearchParam(chave: string, valor?: string) {
		const params = new URLSearchParams(searchParams);

		if (valor) {
			params.set(chave, valor);
		} else {
			params.delete(chave);
		}

		setParams(params);
	}

	async function getFarmacias() {
		const { estado, municipio, nome_fantasia }: Filtros = {
			estado: params?.get("estado") || "",
			municipio: params?.get("municipio") || "",
			nome_fantasia: params?.get("nome_fantasia") || "",
		};

		const filtros: Filtros = {
			pagina,
			limite: 10,
			estado,
			municipio,
			nome_fantasia,
		};

		await fFarmacias
			.getFarmacias(filtros)
			.then((res) => {
				const { dados, documentos_totais, paginas_totais } =
					res.data as GetManyRequest<IFarmacia[]>;

				if (dados.length == 0) {
					if (documentos_totais != 0) {
						addSearchParam("pagina", "1");
					} else {
						setMaxPaginas(0);
					}
				}

				setFarmacias(dados);
				setMaxPaginas(paginas_totais);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		validarToken();
	}, []);

	useEffect(() => {
		getEstados();
	}, [filtroEstado]);

	useEffect(() => {
		const estado = watch("estado");

		if (estado) {
			getMunicipios();
		} else {
			setValue("municipio", "");
			setFiltroMunicipio("");
			setFiltroEstado("");
		}
	}, [watch("estado"), filtroMunicipio]);

	useEffect(() => {
		getFarmacias();
	}, [pagina]);

	useEffect(() => {
		getFarmacias();
	}, [params]);

	useLayoutEffect(() => {
		if (params) {
			router.replace(`${pathname}?${params}`);
		}
	}, [params]);

	if (tokenValido)
		return (
			<>
				<Menu />
				<AdministracaoMain>
					<TituloSecao>LISTAGEM DE FARMÁCIAS</TituloSecao>
					<AdministracaoContainer>
						<AdministracaoFiltros onSubmit={handleSubmit(submitFiltros)}>
							<Controller
								name="nome_fantasia"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer id="nome_fantasia" label="Nome">
											<Input id="nome_fantasia" {...{ ...field, ref: null }} />
										</InputContainer>
									);
								}}
							/>
							<Controller
								name="estado"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer id="estado" label="Estado">
											<Select
												id="estado"
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
								name="municipio"
								control={control}
								render={({ field }) => {
									return (
										<InputContainer id="municipio" label="Municipio">
											<Select
												id="municipio"
												filtro={filtroMunicipio}
												opcoes={municipios}
												placeholder="Vilhena"
												disabled={!watch("estado")}
												setFiltro={setFiltroMunicipio}
												setValue={setValue}
												{...{ ...field, ref: null }}
											/>
										</InputContainer>
									);
								}}
							/>
							<AdministracaoConfirmarFiltros onClean={cleanFiltros} />
						</AdministracaoFiltros>
						{farmacias.length > 0 && (
							<AdministracaoListagem>
								{farmacias.map((f, i) => {
									return (
										<AdministracaoItem
											key={i}
											imagem_url={f.imagem_url}
											onDelete={() => {
												setFarmaciaParaRemover(f);
											}}
											linkEditar={`/administracao/farmacias/editar/${f._id}`}
										>
											{f.nome_fantasia}
										</AdministracaoItem>
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
								addSearchParam("pagina", v.toString());
							}}
						/>
					)}
				</AdministracaoMain>
				<Alert
					show={!!farmaciaParaRemover}
					onClickBackground={() => {
						setFarmaciaParaRemover(undefined);
					}}
				>
					<div className={styles.alert}>
						<span>
							Deseja remover a farmácia {farmaciaParaRemover?.nome_fantasia}?
						</span>
						<div className={styles.alert_botoes}>
							<Botao
								fullWidth
								onClick={() => {
									removerFarmacia();
								}}
							>
								Confirmar
							</Botao>
							<Botao
								fullWidth
								secundario
								onClick={() => {
									setFarmaciaParaRemover(undefined);
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
