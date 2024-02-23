"use client";

import styles from "./CadastroFarmacia.module.scss";
import Menu from "@/components/Menu";
import TituloSecao from "@/components/TituloSecao";
import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";

export default function CadastroFarmacia() {
	redirecionarAutenticacao();

	return (
		<>
			<Menu />
			<main className={styles.main}>
				<TituloSecao>CADASTRO DE FARMÁCIA</TituloSecao>
				<form className={styles.form}></form>
			</main>
		</>
	);
}
