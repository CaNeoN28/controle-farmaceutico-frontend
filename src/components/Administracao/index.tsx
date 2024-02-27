import { ReactNode } from "react";
import styles from "./Administracao.module.scss";

interface DefaultProps {
	children?: ReactNode;
}

export function AdministracaoMain({ children }: DefaultProps) {
	return <main className={styles.main_administracao}>{children}</main>;
}

export function AdministracaoContainer({ children }: DefaultProps) {
	return <div className={styles.container_administracao}>{children}</div>;
}

export function AdministracaoFiltros({ children }: DefaultProps) {
	return <div className={styles.filtros_administracao}>{children}</div>;
}

export function AdministracaoListagem({ children }: DefaultProps) {
	return <div className={styles.Administracao_listagem}>{children}</div>;
}

export function AdministracaoItem({ children }: DefaultProps) {
	return <div className={styles.administracao_item}>{children}</div>;
}
