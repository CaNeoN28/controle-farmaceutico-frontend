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
	AdministracaoContainer,
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

interface Filtros {
	pagina?: number;
	limite?: number;
	nome_entidade?: string;
	estado?: string;
	municipio?: string;
}

export default function EntidadesAdministracao() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const getPerfil = new FetchAutenticacao().getPerfil;
	const fEntidades = new FetchEntidades();

	const { estado, municipio, nome_entidade, pagina }: Filtros = {
		pagina: Number(searchParams.get("pagina")) || 1,
		estado: searchParams.get("estado") || "",
		municipio: searchParams.get("municipio") || "",
		nome_entidade: searchParams.get("nome_entidade") || "",
	};

	const [params, setParams] = useState<URLSearchParams>(searchParams);
	const [maxPaginas, setMaxPaginas] = useState(5);

	const [entidades, setEntidades] = useState<IEntidade[]>([]);

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

	async function getEntidades() {
		const { estado, nome_entidade, municipio }: Filtros = {
			estado: params.get("estado") || "",
			municipio: params.get("municipio") || "",
			nome_entidade: params.get("nome_entidade") || "",
		};

		const filtros: Filtros = {
			estado,
			municipio,
			nome_entidade,
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
				<Menu />
				<AdministracaoMain>
					<TituloSecao>LISTAGEM DE ENTIDADES</TituloSecao>
					<AdministracaoContainer>
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
											onDelete={() => {}}
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
			</>
		);

	return <></>;
}
