import Link from "next/link";
import { ReactNode } from "react";
import { MdLocalPharmacy, MdLocationCity, MdPerson } from "react-icons/md";
import styles from "./OpcaoAdministrativa.module.scss";

interface Props {
	url_destino: string;
	tipo: "farmacia" | "usuario" | "entidade";
	children?: ReactNode;
}

export default function OpcaoAdministrativa({
	url_destino,
	tipo,
	children,
}: Props) {
	const icone =
		tipo == "entidade" ? (
			<MdLocationCity />
		) : tipo == "farmacia" ? (
			<MdLocalPharmacy />
		) : (
			<MdPerson />
		);

	return (
		<Link href={url_destino} className={styles.opcao_administrativa}>
			<div className={styles.icone}>{icone}</div>
			<div className={styles.content}>{children}</div>
		</Link>
	);
}
