import DiaSemana from "./DiasSemana";
import Endereco from "./Endereco";

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
	endereco: Endereco;
	plantoes: {
		entrada: string;
		saida: string;
	}[];
	horarios_servico: {
		[dia_semana in DiaSemana]: {
			horario_entrada: string;
			horario_saida: string;
		};
	};
	imagem_url?: string;
	__v: 0;
}
