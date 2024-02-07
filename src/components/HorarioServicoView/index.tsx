import styles from "./HorarioServicoView.module.scss";

interface Props {
	dia_semana: string;
	entrada: string;
	saida: string;
}

export default function HorarioServicoView({
	dia_semana,
	entrada,
	saida,
}: Props) {
	return (
		<div>
			<span>{dia_semana}</span>
			<span>
				{entrada}/{saida}
			</span>
		</div>
	);
}
