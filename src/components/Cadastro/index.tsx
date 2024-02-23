import { FormEventHandler, ReactNode } from "react";
import styles from "./Cadastro.module.scss";

export function CadastroMain({ children }: { children?: ReactNode }) {
	return <main className={styles.main_cadastro}>{children}</main>;
}

export function CadastroForm({
	onSubmit,
	children,
}: {
	onSubmit: FormEventHandler<HTMLFormElement>;
	children?: ReactNode;
}) {
	return (
		<form onSubmit={onSubmit} className={styles.formulario_cadastro}>
			{children}
		</form>
	);
}

export function CadastroEtapa({
	titulo,
	children,
}: {
	titulo: string;
	children?: ReactNode;
}) {
	return (
		<div className={styles.etapa_cadastro}>
			<span className={styles.titulo_etapa_cadastro}>{titulo}</span>
			{children}
		</div>
	);
}

export function CadastroInputs({ children }: { children?: ReactNode }) {
	return <div className={styles.inputs_cadastro}>{children}</div>;
}

export function CadastroBotoes({ children }: { children?: ReactNode }) {
	return <div className={styles.botoes_cadastro}>{children}</div>;
}
