export interface GetManyRequest<T> {
	dados: T;
	documentos_totais: number;
	limite: number;
	pagina: number;
	paginas_totais: number;
}

export interface RequestErro<T> {
	response: {
		data: T;
		status: number;
		statusText: string;
	};
	message: string;
	code: string;
}
