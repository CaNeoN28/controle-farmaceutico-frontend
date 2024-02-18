const estados: { [key: string]: string } = {
	Acre: "AC",
	Alagoas: "AL",
	Amapá: "AP",
	Amazonas: "AM",
	Bahia: "BA",
	Ceará: "CE",
	"Distrito Federal": "DF",
	"Espírito Santo": "ES",
	Goiás: "GO",
	Maranhão: "MA",
	"Mato Grosso": "MT",
	"Mato Grosso do Sul": "MS",
	"Minas Gerais": "MG",
	Pará: "PA",
	Paraíba: "PB",
	Paraná: "PR",
	Pernambuco: "PE",
	Piauí: "PI",
	"Rio de Janeiro": "RJ",
	"Rio Grande do Norte": "RN",
	"Rio Grande do Sul": "RS",
	Rondônia: "RO",
	Roraima: "RR",
	"Santa Catarina": "SC",
	"São Paulo": "SP",
	Sergipe: "SE",
	Tocantins: "TO",
};

export function getEstadoFromSigla(sigla: string) {
	let estado: string | undefined = undefined;

	Object.keys(estados).map((e) => {
		if (estados[e] === sigla) {
			estado = e;
		}
	});

	return estado;
}

export function getSiglaFromEstado(estado: string) {
	const sigla = estados[estado];

	return sigla;
}
