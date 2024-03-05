import { MdLocalPharmacy } from "react-icons/md";
import styles from "./FarmaciaItem.module.scss";
import classNames from "classnames";
import Link from "next/link";

interface Props {
	nome: string;
	informacao: string;
	para: string;
	imagem_url?: string;
}

export default function FarmaciaItem({
	informacao,
	nome,
	para,
	imagem_url,
}: Props) {
	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	const classes = classNames({
		[styles.item]: true,
		"box-shadow": true,
	});
	return (
		<Link href={para} className={classes}>
			<div className={styles.imagem}>
				<span className={styles.placeholder}>
					<MdLocalPharmacy />
				</span>
				{imagem_url && <img src={`${API_URL}/imagem/${imagem_url}`} loading="lazy"/>}
			</div>
			<div className={styles.conteudo}>
				<span>{nome}</span>
				<span>{informacao}</span>
			</div>
		</Link>
	);
}
