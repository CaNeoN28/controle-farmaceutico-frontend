type DiaSemana =
	| "segunda_feira"
	| "terca_feira"
	| "quarta_feira"
	| "quinta_feira"
	| "sexta_feira"
	| "sabado"
	| "domingo";

const getDayName = (dia: DiaSemana) => {
	const dias = {
		"domingo": "Domingo",
		"segunda_feira": "Segunda feira",
		"terca_feira": "Terca feira",
		"quarta_feira": "Quarta feira",
		"quinta_feira": "Quinta feira",
		"sexta_feira": "Sexta feira",
		"sabado": "Sábado",
	}	

	return dias[dia]
}

const getDayFromNum = (num: number) : DiaSemana => {
	const days : DiaSemana[] = [
		"domingo",
		"segunda_feira",
		"terca_feira",
		"quarta_feira",
		"quinta_feira",
		"sexta_feira",
		"sabado",
	];

	return days[num];
};


export default DiaSemana;

export { getDayFromNum, getDayName };
