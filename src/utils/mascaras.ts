export const mascararCnpj = (cnpj: string) => {
	const string = cnpj
		.split("")
		.map((l, i) => {
			if (i === 1) {
				return l + ".";
			} else if (i === 4) {
				return l + ".";
			} else if (i === 7) {
				return l + "/";
			} else if (i === 11) {
				return l + "-";
			} else {
				return l;
			}
		})
		.join("");

	return string;
};

export const mascararCPF = (cpf: string) => {
	const string = cpf.split("").map((l, i) => {
		switch (i) {
			case 2:
				return l + ".";
			case 5:
				return l + ".";
			case 8:
				return l + "-";
			default:
				return l;
		}
	});

	return string;
};
