import DiaSemana from "./DiasSemana";

export interface Escala {
	[dia: string]: IFarmacia[];
}

export interface IFarmaciaAberta extends IFarmacia {
	dia_semana: string;
}

export interface IFarmaciaPlantao extends IFarmacia {
	data: string;
}

export default interface IFarmacia {
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