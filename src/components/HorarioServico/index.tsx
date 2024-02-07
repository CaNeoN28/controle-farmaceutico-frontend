import { MdOutlineClose } from "react-icons/md";
import { MouseEventHandler } from "react";
import styles from "./HorarioServico.module.scss";

interface Props {
	dia_semana: string;
	entrada: string;
	saida: string;
	onClick: MouseEventHandler<SVGElement>;
}

export default function HorarioServico({
	dia_semana,
	entrada,
	saida,
	onClick,
}: Props) {
	return (
		<div className={styles.horario_servico}>
			<div className={styles.content}>
				<span>{dia_semana}</span>
				<span>
					{entrada} - {saida}
				</span>
			</div>
			<MdOutlineClose className={styles.close} onClick={onClick} />
		</div>
	);
}
