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
