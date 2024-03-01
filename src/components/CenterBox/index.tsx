import styles from "./CenterBox.module.scss";
import { ReactNode } from "react";

interface Props {
	titulo?: string;
	children?: ReactNode;
}

export default function CenterBox({ children, titulo }: Props) {
	return (
		<form className={styles.center_box}>
			{titulo && <span className={styles.titulo}>{titulo}</span>}
			<div className={styles.inputs}>{children}</div>
			<div className={styles.botoes}>
				
			</div>
		</form>
	);
}
