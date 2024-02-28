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
import { IUsuarioAPI } from "@/types/Usuario";
import { getUsuarios } from "@/fetch/usuarios";
import { GetManyRequest } from "@/types/Requests";
import { getCookie } from "cookies-next";
import FetchAutenticacao from "@/fetch/autenticacao";
import { mascararCPF } from "@/utils/mascaras";
import verificarPermissao from "@/utils/verificarPermissao";

interface Filtros {}

export default function UsuariosAdministracao() {
	redirecionarAutenticacao();

	const fAuth = new FetchAutenticacao();

	const [usuario, setUsuario] = useState<IUsuarioAPI>();
	const [token, setToken] = useState("");

	const [usuarios, setUsuarios] = useState<IUsuarioAPI[]>([]);

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
		await getUsuarios({ limite: 10, pagina: 1 }, token)
			.then((res) => {
				const { dados } = res.data as GetManyRequest<IUsuarioAPI[]>;

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
				</AdministracaoMain>
			</>
		);

	return <></>;
}
