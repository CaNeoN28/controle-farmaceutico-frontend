export interface FiltrosEntidade {
	estado?: string;
	municipio?: string;
	nome_entidade?: string;
	ativo?: "SIM" | "NAO" | "TODOS";
	pagina?: number;
	limite?: number;
}
