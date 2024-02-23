"use client";

import styles from "./CadastroFarmacia.module.scss";
import Menu from "@/components/Menu";
import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";

export default function CadastroFarmacia() {
	redirecionarAutenticacao()

	return (
		<>
			<Menu />
			<main></main>
		</>
	);
}
