import { TbPointFilled } from "react-icons/tb";
import styles from "./Carregando.module.scss";

export default function Carregando() {
	return (
		<div className={styles.carregando}>
			<span>Carregando</span>
			<div className={styles.icones}>
				<TbPointFilled style={{animationDelay: "200ms"}}/>
				<TbPointFilled style={{animationDelay: "400ms"}}/>
				<TbPointFilled style={{animationDelay: "600ms"}}/>
			</div>
		</div>
	);
}
