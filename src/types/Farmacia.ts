import DiaSemana from "./DiasSemana";

export interface Escala {
	[dia: string]: Farmacia[];
}

export interface FarmaciaAberta extends Farmacia {
	dia_semana: string;
}

export interface FarmaciaPlantao extends Farmacia {
	data: string;
}

export default interface Farmacia {
	_id: string;
	cnpj: string;
	nome_fantasia: string;
	endereco: {
		cep: string;
		estado: string;
		municipio: string;
		bairro: string;
		logradouro: string;
		numero: string;
		localizacao: {
			x: number;
			y: number;
		};
	};
	plantoes: string[];
	horarios_servico: {
		[dia_semana in DiaSemana]: {
			horario_entrada: string;
			horario_saida: string;
		};
	};
	imagem_url?: string;
	__v: 0;
}
