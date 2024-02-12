import DiasSemana from "./DiasSemana";

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
		[dia_semana in DiasSemana]: {
			horario_entrada: string;
			horario_saida: string;
		};
	};
	__v: 0;
}
