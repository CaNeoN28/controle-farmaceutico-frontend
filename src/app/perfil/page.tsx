"use client";

import Menu from "@/components/Menu";
import styles from "./Perfil.module.scss";
import { CadastroContainer } from "@/components/Cadastro";

export default function Perfil() {
	return (
		<>
			<Menu />
			<main className={styles.main}>
				<CadastroContainer></CadastroContainer>
			</main>
		</>
	);
}
