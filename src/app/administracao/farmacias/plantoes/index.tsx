import { Dispatch, SetStateAction } from "react";
import styles from "./Plantoes.module.scss";
import DiaPlantao from "@/components/DiaPlantao";

interface Plantao {
	entrada: string;
	saida: string;
}

interface Props {
	plantoes: Plantao[];
	setPlantoes: Dispatch<SetStateAction<Plantao[]>>;
}

export default function Plantoes({ plantoes, setPlantoes }: Props) {
	return (
		<div className={styles.etapa_retratil}>
			<div className={styles.form}></div>
			{plantoes.length > 0 && (
				<div className={styles.plantoes}>
					{plantoes.map((p, i) => {
						return (
							<DiaPlantao
								key={i}
								data={p.entrada}
								onClick={() => {
									const plantoesNovos = [...plantoes];
									delete plantoesNovos[i];

									setPlantoes(plantoesNovos);
								}}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
