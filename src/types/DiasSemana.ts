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

type DiaSemana =
	| "segunda_feira"
	| "terca_feira"
	| "quarta_feira"
	| "quinta_feira"
	| "sexta_feira"
	| "sabado"
	| "domingo";

export default DiaSemana;

export { getDayFromNum };
