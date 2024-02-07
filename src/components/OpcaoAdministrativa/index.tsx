import Link from "next/link";
import { ReactNode } from "react";
import styles from "./OpcaoAdministrativa.module.scss";

interface Props {
	url_destino: string;
	children?: ReactNode;
}

export default function OpcaoAdministrativa({ url_destino, children }: Props) {
	return (
		<Link href={url_destino} className={styles.opcao_administrativa}>
			<div className={styles.content}>{children}</div>
		</Link>
	);
}
