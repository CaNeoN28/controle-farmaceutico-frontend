import { ReactNode } from "react";
import styles from "./TituloSecao.module.scss";

interface Props {
	children?: ReactNode;
}

export default function TituloSecao({ children }: Props) {
	return <div className={styles.titulo_secao}>{children}</div>;
}
