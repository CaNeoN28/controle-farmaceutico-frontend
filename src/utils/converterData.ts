export default function converterData(data: string | number) {
	const toDate = new Date(data);

	if (isNaN(Number(toDate))) {
		return NaN;
	}

	const { dia, mes, ano } = {
		ano: String(toDate.getFullYear()),
		dia: String(toDate.getDate()),
		mes: String(toDate.getMonth() + 1),
	};

	const newDate = [dia, mes, ano].map((v) => v.padStart(2, "0")).join("/");

	return newDate
}
