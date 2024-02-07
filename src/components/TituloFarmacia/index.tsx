import styles from "./TituloFarmacia.module.scss";
import { MdLocalPharmacy } from "react-icons/md";

interface Props {
	image_url?: string;
}

export default function TituloFarmacia({ image_url }: Props) {
	return (
		<div className={styles.titulo_farmacia}>
			<div className={styles.content}></div>
			{image_url ? (
				<image href={image_url} />
			) : (
				<div className={styles.placeholder}>
					<MdLocalPharmacy/>
				</div>
			)}
		</div>
	);
}
