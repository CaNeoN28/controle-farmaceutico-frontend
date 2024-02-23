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
