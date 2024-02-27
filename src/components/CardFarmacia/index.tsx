import Link from "next/link";
import { MdLocalPharmacy } from "react-icons/md";
import styles from "./CardFarmacia.module.scss";
import classNames from "classnames";

interface Props {
	link_farmacia: string;
	nome: string;
	informacao?: string;
	imagem_url?: string;
}

export default function CardFarmacia({
	link_farmacia,
	informacao,
	nome,
	imagem_url,
}: Props) {
	const API_URL = process.env.NEXT_PUBLIC_API_URL

	const classesCard = classNames({
		[styles.card_farmacia]: true,
		["box-shadow"]: true,
	});

	return (
		<Link href={link_farmacia} className={classesCard}>
			<div className={styles.imagem}>
				{imagem_url ? (
					<img src={`${API_URL}${imagem_url}`} alt="imagem" />
				) : (
					<div className={styles.placeholder}>
						<MdLocalPharmacy />
					</div>
				)}
			</div>
			<div className={styles.dados}>
				<span>{nome}</span>
				<span>{informacao}</span>
			</div>
		</Link>
	);
}
