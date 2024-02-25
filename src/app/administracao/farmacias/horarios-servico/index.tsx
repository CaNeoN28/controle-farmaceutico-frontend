import InputContainer from "@/components/InputContainer";
import styles from "./HorariosServico.module.scss";
import Select, { Opcao } from "@/components/Select";
import Botao from "@/components/Botao";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IHorarioDia, IHorário } from "@/types/Farmacia";
import { FieldError } from "react-hook-form";
import Input from "@/components/Input";
import HorarioServico from "@/components/HorarioServico";
import DiaSemana, { getDayName } from "@/types/DiasSemana";

interface Erros {
	dia_semana?: FieldError;
	horario_entrada?: FieldError;
	horario_saida?: FieldError;
}
interface Props {
	errosHorario: Erros;
	horario: { [key: string]: IHorário };
	setHorario: Dispatch<SetStateAction<{ [key: string]: IHorário }>>;
	setErros: Dispatch<SetStateAction<Erros>>;
}

const OpcoesDiaSemana: Opcao[] = [
	{
		label: "Domingo",
		valor: "domingo",
	},
	{
		label: "Segunda feira",
		valor: "segunda_feira",
	},
	{
		label: "Terça feira",
		valor: "terca_feira",
	},
	{
		label: "Quarta feira",
		valor: "quarta_feira",
	},
	{
		label: "Quinta feira",
		valor: "quinta_feira",
	},
	{
		label: "Sexta feira",
		valor: "sexta_feira",
	},
	{
		label: "Sábado",
		valor: "sabado",
	},
];

export default function HorariosServico({
	horario,
	errosHorario,
	setHorario,
	setErros,
}: Props) {
	const [diaSemana, setDiaSemana] = useState("");
	const [filtroDiaSemana, setFiltroDiaSemana] = useState("");

	const [horarioEntrada, setHorarioEntrada] = useState("");
	const [horarioSaida, setHorarioSaida] = useState("");

	const onSubmit = () => {
		const erros: string[] = [];

		if (!diaSemana) {
			erros.push("dia_semana:Dia da semana é obrigatório");
		}

		if (!horarioEntrada) {
			erros.push("horario_entrada:Horário de entrada é obrigatório");
		}

		if (!horarioSaida) {
			erros.push("horario_saida:Horário de saída é obrigatório");
		}

		if (erros.length > 0) {
			const erroObject: any = {};

			erros.map((e) => {
				const [campo, valor] = e.split(":");

				erroObject[campo] = {
					message: valor,
				};
			});

			setErros(erroObject);

			return false;
		}
		setHorario({
			...horario,
			[diaSemana]: {
				horario_entrada: horarioEntrada,
				horario_saida: horarioSaida,
			},
		});

		setErros({});
		return true;
	};

	useEffect(() => {
		setErros({
			...errosHorario,
			dia_semana: undefined,
		});
	}, [diaSemana]);

	useEffect(() => {
		setErros({
			...errosHorario,
			horario_entrada: undefined,
		});

		if (horarioSaida && horarioEntrada) {
			const [horaEntrada, minutoEntrada] = horarioEntrada
				.split(":")
				.map((e) => Number(e));
			const [horaSaida, minutoSaida] = horarioSaida
				.split(":")
				.map((e) => Number(e));

			if (
				horaEntrada > horaSaida ||
				(horaEntrada == horaSaida && minutoEntrada > minutoSaida)
			) {
				setHorarioSaida(horarioEntrada);
			}
		} else {
			setHorarioSaida(horarioEntrada);
		}
	}, [horarioEntrada]);

	useEffect(() => {
		setErros({
			...errosHorario,
			horario_saida: undefined,
		});

		if (horarioSaida && horarioEntrada) {
			const [horaEntrada, minutoEntrada] = horarioEntrada
				.split(":")
				.map((e) => Number(e));
			const [horaSaida, minutoSaida] = horarioSaida
				.split(":")
				.map((e) => Number(e));

			if (
				horaEntrada > horaSaida ||
				(horaEntrada == horaSaida && minutoEntrada > minutoSaida)
			) {
				setHorarioEntrada(horarioSaida);
			}
		} else {
			setHorarioEntrada(horarioSaida);
		}
	}, [horarioSaida]);

	return (
		<div className={styles.etapa_retratil}>
			<div className={styles.form}>
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
				<InputContainer
					id="horario_saida"
					label="Horário saida"
					error={errosHorario.horario_saida}
				>
					<Input
						id="horario_saida"
						type="time"
						onChange={(e) => {
							setHorarioSaida(e.target.value);
						}}
						value={horarioSaida}
					/>
				</InputContainer>
				<Botao
					type="submit"
					fullWidth
					onClick={(e) => {
						e.preventDefault();
						const sucesso = onSubmit();

						if (sucesso) {
							setHorarioEntrada("");
							setHorarioSaida("");
							setDiaSemana("");
							setFiltroDiaSemana("");
						}
					}}
				>
					<span>Adicionar</span>
					<FaPlus />
				</Botao>
			</div>
			{Object.keys(horario).length > 0 && (
				<div className={styles.horarios}>
					{Object.keys(horario).map((key) => {
						const { horario_entrada, horario_saida } = horario[key];
						const diaSemana = getDayName(key as DiaSemana);
						return (
							<HorarioServico
								key={key}
								dia_semana={diaSemana}
								entrada={horario_entrada}
								saida={horario_saida}
								onClick={() => {
									const horarioNovo = { ...horario };
									delete horarioNovo[key];

									setHorario(horarioNovo);
								}}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
