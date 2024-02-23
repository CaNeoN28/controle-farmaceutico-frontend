export interface Coordenadas {
	lat: number;
	lng: number;
}

export interface DadosCep {
	cep: string;
	logradouro: string;
	complemento: string;
	bairro: string;
	localidade: string;
	uf: string;
	ibge: string;
	erro?: boolean;
}

export interface Estado {
	id: number;
	sigla: string;
	nome: string;
	regiao: {
		id: string;
		sigla: string;
		nome: string;
	};
}

export interface Municipio {
	id: number;
	nome: string;
	microrregiao: {
		id: number;
		nome: string;
		mesorregiao: {
			id: number;
			nome: string;
			UF: {
				id: number;
				sigla: string;
				nome: string;
				regiao: {
					id: number;
					sigla: string;
					nome: string;
				};
			};
		};
	};
}
