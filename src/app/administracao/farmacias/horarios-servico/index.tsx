import InputContainer from "@/components/InputContainer";
import styles from "./HorariosServico.module.scss";
import Select, { Opcao } from "@/components/Select";
import Botao from "@/components/Botao";
import { Dispatch, SetStateAction, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IHorarioDia } from "@/types/Farmacia";
import { FieldError } from "react-hook-form";

interface Props {
	errosHorario: {
		dia_semana?: FieldError;
		horario_entrada?: FieldError;
		horario_saida?: FieldError;
	};
	onSubmitHorario: ({
		dia_semana,
		horario_entrada,
		horario_saida,
	}: IHorarioDia) => void;
}

const OpcoesDiaSemana: Opcao[] = [
	{
		label: "Domingo",
		valor: "domingo",
	},
	{
		label: "Segunda-feira",
		valor: "segunda-feira",
	},
	{
		label: "Terça-feira",
		valor: "terca-feira",
	},
	{
		label: "Quarta-feira",
		valor: "quarta-feira",
	},
	{
		label: "Quinta-feira",
		valor: "quinta-feira",
	},
	{
		label: "Sexta-feira",
		valor: "sexta-feira",
	},
	{
		label: "Sábado",
		valor: "sabado",
	},
];

export default function HorariosServico({
	errosHorario,
	onSubmitHorario,
}: Props) {
	const [diaSemana, setDiaSemana] = useState("");
	const [filtroDiaSemana, setFiltroDiaSemana] = useState("");

	return (
		<div className={styles.etapa_retratil}>
			<InputContainer
				id="dia_semana"
				label="Dia da semana"
				error={errosHorario.dia_semana}
			>
				<Select
					name="dia_semana"
					placeholder="Segunda feira"
					filtro={filtroDiaSemana}
					opcoes={OpcoesDiaSemana}
					value={diaSemana}
					setFiltro={setFiltroDiaSemana}
					setValueState={setDiaSemana}
				/>
			</InputContainer>
			<Botao
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					onSubmitHorario({
						dia_semana: diaSemana,
						horario_entrada: "",
						horario_saida: "",
					});
				}}
			>
				<span>Adicionar</span>
				<FaPlus />
			</Botao>
		</div>
	);
}
