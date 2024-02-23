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
	return <form onSubmit={onSubmit} className={styles.formulario_cadastro}>{children}</form>;
}
