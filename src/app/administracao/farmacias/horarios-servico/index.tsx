import InputContainer from "@/components/InputContainer";
import styles from "./HorariosServico.module.scss";
import Select, { Opcao } from "@/components/Select";
import Botao from "@/components/Botao";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IHorarioDia } from "@/types/Farmacia";
import { FieldError } from "react-hook-form";
import Input from "@/components/Input";

interface Erros {
	dia_semana?: FieldError;
	horario_entrada?: FieldError;
	horario_saida?: FieldError;
}
interface Props {
	errosHorario: Erros;
	setErros: Dispatch<SetStateAction<Erros>>;
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
	setErros,
	onSubmitHorario,
}: Props) {
	const [diaSemana, setDiaSemana] = useState("");
	const [filtroDiaSemana, setFiltroDiaSemana] = useState("");

	const [horarioEntrada, setHorarioEntrada] = useState("");

	useEffect(() => {
		setErros({});
	}, [diaSemana, horarioEntrada]);

	return (
		<div className={styles.etapa_retratil}>
			<div className={styles.form_inputs}>
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
				<InputContainer
					id="horario_entrada"
					label="Horário entrada"
					error={errosHorario.horario_entrada}
				>
					<Input
						id="horario_entrada"
						type="time"
						onChange={(e) => {
							setHorarioEntrada(e.target.value);
						}}
						value={horarioEntrada}
					/>
				</InputContainer>
			</div>
			<Botao
				type="submit"
				onClick={(e) => {
					e.preventDefault();
					onSubmitHorario({
						dia_semana: diaSemana,
						horario_entrada: horarioEntrada,
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
