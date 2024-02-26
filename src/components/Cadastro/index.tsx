import React, { FormEventHandler, ReactNode } from "react";
import styles from "./Cadastro.module.scss";

export function CadastroMain({ children }: { children?: ReactNode }) {
	return <main className={styles.main_cadastro}>{children}</main>;
}

export function CadastroContainer({ children }: { children?: ReactNode }) {
	return <div className={styles.container_cadastro}>{children}</div>;
}

interface CadastroProps extends React.ComponentPropsWithoutRef<"form"> {}

export function CadastroForm({ onSubmit, children, ...props }: CadastroProps) {
	return (
		<form onSubmit={onSubmit} className={styles.formulario_cadastro} {...props}>
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
