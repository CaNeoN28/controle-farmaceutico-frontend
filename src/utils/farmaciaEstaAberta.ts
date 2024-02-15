import { getDayFromNum } from "@/types/DiasSemana";
import Farmacia from "@/types/Farmacia";

export default function farmaciaEstaAberta(farmacia: Farmacia, horario: Date) {
	const horarios = farmacia.horarios_servico;
	const plantoes = farmacia.plantoes;

	const { hora, minuto, dia_semana } = {
		dia_semana: getDayFromNum(horario.getDay()),
		hora: horario.getHours(),
		minuto: horario.getMinutes(),
	};

	let noHorario = false;
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

	const umDia = 60 * 60 * 24 * 1000;

	if (hora < 7) {
		console.log(hora)
		horario = new Date(Number(horario) - umDia);
	}

	const { dia, mes, ano } = {
		ano: horario.getFullYear(),
		mes: horario.getMonth() + 1,
		dia: horario.getDate(),
	};

	const data = [ano, mes, dia].join("/")

	const nosPlantoes = plantoes.find(p => {
		return Number(new Date(data)) === Number(new Date(p)) 
	}) 

	return noHorario || nosPlantoes;
}
