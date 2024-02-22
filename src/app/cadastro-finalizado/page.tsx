"use client";

import Menu from "@/components/Menu";
import styles from "./CadastroFinalizado.module.scss";
import LinkButton from "@/components/LinkButton";

export default function CadastroFinalizado() {
	return (
		<>
			<Menu />
			<main className={styles.container}>
				<div className={styles.content}>
					<div className={styles.text}>
						<span className={styles.title}>USUÁRIO CADASTRADO</span>
						<span>Por favor aguarde a verificação de um administrador</span>
					</div>
					<LinkButton link="/">Voltar</LinkButton>
				</div>
			</main>
		</>
	);
}
