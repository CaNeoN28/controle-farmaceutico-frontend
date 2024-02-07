import React from "react";
import styles from "./TituloFarmacia.module.scss";
import { MdLocalPharmacy } from "react-icons/md";

interface Props {
	image_url?: string;
	children?: React.ReactNode;
}

export default function TituloFarmacia({ image_url, children }: Props) {
	return (
		<div className={styles.titulo_farmacia}>
			<div className={styles.content}>
				{children}
			</div>
			{image_url ? (
				<image href={image_url} />
			) : (
				<div className={styles.placeholder}>
					<MdLocalPharmacy />
				</div>
			)}
		</div>
	);
}
