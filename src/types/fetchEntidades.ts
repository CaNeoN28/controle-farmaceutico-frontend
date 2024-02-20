export interface FiltrosEntidade {
	estado?: string;
	municipio?: string;
	nome_entidade?: string;
	ativo?: "SIM" | "NÃO" | "TODOS";
	pagina?: number;
	limite?: number;
}
