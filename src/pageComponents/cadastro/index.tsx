import { ReactNode } from "react";
import styles from "./Cadastro.module.scss";

export function CadastroMain({ children }: { children?: ReactNode }) {
	return <main className={styles.main_cadastro}>{children}</main>;
}
