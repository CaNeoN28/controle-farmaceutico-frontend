"use client";

import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";
import styles from "./UsuariosAdministracao.module.scss";
import Menu from "@/components/Menu";
import {
	AdministracaoContainer,
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

interface Filtros {
	pagina?: number;
	limite?: number;
	nome_completo?: string;
	entidade?: string;
	funcao?: Funcao;
}

export default function UsuariosAdministracao() {
	redirecionarAutenticacao();

	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const fAuth = new FetchAutenticacao();

	const { pagina }: Filtros = {
		pagina: Number(searchParams.get("pagina")) || 1,
	};

	const [usuario, setUsuario] = useState<IUsuarioAPI>();
	const [token, setToken] = useState("");

	const [usuarios, setUsuarios] = useState<IUsuarioAPI[]>([]);

	const [params, setParams] = useState<URLSearchParams>(searchParams);
	const [maxPaginas, setMaxPaginas] = useState<number>(5);

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
