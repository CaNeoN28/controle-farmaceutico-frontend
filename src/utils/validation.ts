export function validarCPF(strCPF: String) {
	var Soma;
	var Resto;
	Soma = 0;
	if (strCPF == "00000000000") return false;

	for (let i = 1; i <= 9; i++)
		Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
	Resto = (Soma * 10) % 11;

	if (Resto == 10 || Resto == 11) Resto = 0;
	if (Resto != parseInt(strCPF.substring(9, 10))) return false;

	Soma = 0;
	for (let i = 1; i <= 10; i++)
		Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
	Resto = (Soma * 10) % 11;

	if (Resto == 10 || Resto == 11) Resto = 0;
	if (Resto != parseInt(strCPF.substring(10, 11))) return false;
	return true;
}

export function validarCNPJ(strCNPJ: string){
	strCNPJ = strCNPJ.replace(/[^\d]+/g, "");

	if (strCNPJ == "") return false;

	if (strCNPJ.length != 14) return false;

	if (isNaN(Number(strCNPJ))) return false;

	// Elimina CNPJs invalidos conhecidos
	if (
		strCNPJ == "00000000000000" ||
		strCNPJ == "11111111111111" ||
		strCNPJ == "22222222222222" ||
		strCNPJ == "33333333333333" ||
		strCNPJ == "44444444444444" ||
		strCNPJ == "55555555555555" ||
		strCNPJ == "66666666666666" ||
		strCNPJ == "77777777777777" ||
		strCNPJ == "88888888888888" ||
		strCNPJ == "99999999999999"
	)
		return false;

	// Valida DVs
	let tamanho = strCNPJ.length - 2;
	let numeros = strCNPJ.substring(0, tamanho);
	const digitos = strCNPJ.substring(tamanho);
	let soma = 0;
	let pos = tamanho - 7;
	for (let i = tamanho; i >= 1; i--) {
		soma += Number(numeros.charAt(tamanho - i)) * pos--;
		if (pos < 2) pos = 9;
	}
	let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	if (resultado != Number(digitos.charAt(0))) return false;

	tamanho = tamanho + 1;
	numeros = strCNPJ.substring(0, tamanho);
	soma = 0;
	pos = tamanho - 7;
	for (let i = tamanho; i >= 1; i--) {
		soma += Number(numeros.charAt(tamanho - i)) * pos--;
		if (pos < 2) pos = 9;
	}
	resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	if (resultado != Number(digitos.charAt(1))) return false;

	return true;
}