import React from "react";
import styles from "./TituloFarmacia.module.scss";
import { MdLocalPharmacy } from "react-icons/md";

interface Props {
	image_url?: string;
	children?: React.ReactNode;
}

export default function TituloFarmacia({ image_url, children }: Props) {
	const API_URL = process.env.NEXT_PUBLIC_API_URL

	return (
		<div className={styles.titulo_farmacia}>
			<div className={styles.content}>
				{children}
			</div>
			<div className={styles.placeholder}>
					<MdLocalPharmacy />
				</div>
			{image_url && (
				<img src={`${API_URL}/imagem/${image_url}`} className={styles.image} loading="lazy"/>
			)}
		</div>
	);
}
