"use client";

import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";
import styles from "./UsuariosAdministracao.module.scss";
import Menu from "@/components/Menu";
import {
	AdministracaoContainer,
	AdministracaoMain,
} from "@/components/Administracao";
import TituloSecao from "@/components/TituloSecao";

interface Filtros {}

export default function UsuariosAdministracao() {
	redirecionarAutenticacao();

	return (
		<>
			<Menu />
			<AdministracaoMain>
				<TituloSecao>LISTAGEM DE USUÁRIOS</TituloSecao>
				<AdministracaoContainer></AdministracaoContainer>
			</AdministracaoMain>
		</>
	);
}
