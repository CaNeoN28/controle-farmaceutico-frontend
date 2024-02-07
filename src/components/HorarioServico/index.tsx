import { MdOutlineClose } from "react-icons/md";
import styles from "./HorarioServico.module.scss";

interface Props {
	dia_semana: string;
	entrada: string;
	saida: string;
}

export default function HorarioServico({ dia_semana, entrada, saida }: Props) {
	return (
		<div className={styles.horario_servico}>
			<div className={styles.content}>
				<span>{dia_semana}</span>
				<span>
					{entrada} - {saida}
				</span>
			</div>
			<MdOutlineClose className={styles.close} />
		</div>
	);
}
