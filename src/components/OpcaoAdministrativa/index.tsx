import Link from "next/link";
import { ReactNode } from "react";
import { MdLocalPharmacy, MdLocationCity, MdPerson } from "react-icons/md";
import styles from "./OpcaoAdministrativa.module.scss";
import classNames from "classnames";

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

	const classesOpcao = classNames({
		[styles.opcao_administrativa]: true,
		["box-shadow"]: true,
	});

	return (
		<Link href={url_destino} className={classesOpcao}>
			<div className={styles.icone}>{icone}</div>
			<div className={styles.content}>{children}</div>
		</Link>
	);
}
