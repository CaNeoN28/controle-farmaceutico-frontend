import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./Plantoes.module.scss";
import DiaPlantao from "@/components/DiaPlantao";
import Input from "@/components/Input";
import InputContainer from "@/components/InputContainer";
import { FaPlus } from "react-icons/fa";
import Botao from "@/components/Botao";

interface Plantao {
	entrada: string;
	saida: string;
}

interface Props {
	plantoes: Plantao[];
	setPlantoes: Dispatch<SetStateAction<Plantao[]>>;
}

export default function Plantoes({ plantoes, setPlantoes }: Props) {
	const [entrada, setEntrada] = useState("");
	const [saida, setSaida] = useState("");

	const onSubmit = () => {};

	useEffect(() => {
		console.log(entrada);
	}, [entrada]);

	return (
		<div className={styles.etapa_retratil}>
			<div className={styles.form}>
				<InputContainer id="entrada" label="Horário entrada">
					<Input
						id="entrada"
						name="entrada"
						type="datetime-local"
						value={entrada}
						onChange={(e) => setEntrada(e.target.value)}
					/>
				</InputContainer>
				<InputContainer id="saida" label="Horário saida">
					<Input
						id="saida"
						name="saida"
						type="datetime-local"
						value={saida}
						onChange={(e) => setSaida(e.target.value)}
					/>
				</InputContainer>
				<Botao
					onClick={(e) => {
						e.preventDefault();

						onSubmit();
					}}
				>
					<span>Adicionar</span>
					<FaPlus />
				</Botao>
			</div>
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
