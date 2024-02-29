"use client";

import styles from "./EntidadesCadastro.module.scss";
import { CadastroMain } from "@/components/Cadastro";
import Menu from "@/components/Menu";
import TituloSecao from "@/components/TituloSecao";
import FormularioEntidade from "../formulario";
import IEntidade from "@/types/Entidades";

export default function CadastroEntidades() {
	function enviarEntidade(data: IEntidade) {
		console.log(data);
	}

	return (
		<>
			<Menu />
			<CadastroMain>
				<TituloSecao>CADASTRO DE ENTIDADE</TituloSecao>
				<FormularioEntidade enviarEntidade={enviarEntidade} />
			</CadastroMain>
		</>
	);
}
