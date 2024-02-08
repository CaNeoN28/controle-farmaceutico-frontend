import Link from "next/link";
import Image from "next/image";
import { MdLocalPharmacy } from "react-icons/md";
import styles from "./CardFarmacia.module.scss";

interface Props {
	link_farmacia: string;
	nome: string;
	informacao: string;
	imagem_url?: string;
}

export default function CardFarmacia({
	link_farmacia,
	informacao,
	nome,
	imagem_url,
}: Props) {
	return (
		<Link href={link_farmacia} className={styles.card_farmacia}>
			<div className={styles.imagem}>
				{imagem_url ? (
					<img src={imagem_url} alt="imagem" />
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
