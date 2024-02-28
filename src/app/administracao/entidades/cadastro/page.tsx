"use client";

import styles from "./EntidadesCadastro.module.scss";
import { CadastroMain } from "@/components/Cadastro";
import Menu from "@/components/Menu";
import TituloSecao from "@/components/TituloSecao";
import FormularioEntidade from "../formulario";

export default function CadastroEntidades() {
	return (
		<>
			<Menu />
			<CadastroMain>
				<TituloSecao>CADASTRO DE ENTIDADE</TituloSecao>
				<FormularioEntidade />
			</CadastroMain>
		</>
	);
}
