export default interface IUsuario {
	funcao: "ADMINISTRADOR" | "GERENTE" | "USUARIO" | "INATIVO";
	entidade_relacionada: string;
	cpf: string;
	email: string;
	imagem_url: string;
	nome_completo: string;
	nome_usuario: string;
	numero_registro: string;
}

export interface IUsuarioAPI {
	dados_administrativos: {
		funcao?: "ADMINISTRADOR" | "GERENTE" | "USUARIO" | "INATIVO";
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

export interface IUsuarioPost extends IUsuario {
	senha: string;
}

export interface IUsuarioCadastro extends IUsuarioPost {
	confirmacao_senha: string;
}
