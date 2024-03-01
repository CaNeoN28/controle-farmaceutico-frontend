export type Funcao =
	| "ADMINISTRADOR"
	| "GERENTE"
	| "USUARIO"
	| "INATIVO"
	| "ADMINISTRADOR"
	| "GERENTE"
	| "USUARIO"
	| "INATIVO";

export default interface IUsuario {
	_id?: string;
	funcao: Funcao;
	entidade_relacionada: string;
	cpf: string;
	email: string;
	imagem_url: string;
	nome_completo: string;
	nome_usuario: string;
	numero_registro: string;
}

export interface IUsuarioAPI {
	_id?: string;
	dados_administrativos: {
		funcao?: Funcao;
		entidade_relacionada: string;
	};
	cpf: string;
	email: string;
	imagem_url: string;
	nome_completo: string;
	nome_usuario: string;
	numero_registro: string;
	senha?: string;
}

export interface IUsuarioPost extends IUsuarioAPI {
	senha: string;
}

export interface IUsuarioCadastro extends IUsuarioPost {
	confirmacao_senha: string;
}
