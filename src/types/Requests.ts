export interface GetManyRequest<T>{
	dados: T,
	documentos_totais: number,
	limite: number,
	pagina: number,
	paginas_totais: number
}