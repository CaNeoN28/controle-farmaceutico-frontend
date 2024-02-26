import { getDayFromNum } from "@/types/DiasSemana";
import IFarmacia from "@/types/Farmacia";

export default function farmaciaEstaAberta(farmacia: IFarmacia, horario: Date) {
	const horarios = farmacia.horarios_servico;
	const plantoes = farmacia.plantoes;

	const { hora, minuto, dia_semana } = {
		dia_semana: getDayFromNum(horario.getDay()),
		hora: horario.getHours(),
		minuto: horario.getMinutes(),
	};

	let noHorario = false;

	if (horarios) {
		const hoje = horarios[dia_semana];

		if (hoje) {
			const [horaEntrada, minutoEntrada] = hoje.horario_entrada
				.split(":")
				.map((h) => Number(h));

			const [horaSaida, minutoSaida] = hoje.horario_saida
				.split(":")
				.map((h) => Number(h));

			if (
				hora > horaEntrada &&
				(hora < horaSaida || (hora <= horaSaida && minuto < minutoSaida))
			) {
				noHorario = true;
			}
		}
	}

	const nosPlantoes = !!plantoes.find((p) => {
		const { entrada, saida } = {
			entrada: Number(new Date(p.entrada)),
			saida: Number(new Date(p.saida)),
		};

		return entrada <= Number(horario) && saida >= Number(horario);
	});

	return noHorario || nosPlantoes;
}
