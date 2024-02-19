import { ReactNode } from "react";
import styles from "./Listagem.module.scss";

interface Props {
	children?: ReactNode;
}

export default function Listagem({ children }: Props) {
	return <div className={styles.listagem}>{children}</div>;
}
