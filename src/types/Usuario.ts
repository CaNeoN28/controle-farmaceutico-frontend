export default interface IUsuario {
	dados_administrativos: {
		entidade_relacionada: string;
		funcao: "ADMINISTRADOR" | "GERENTE" | "USUARIO" | "INATIVO";
	};
	cpf: string;
	email: string;
	imagem_url: string;
	nome_completo: string;
	nome_usuario: string;
	numero_registro: string;
}

export interface IUsuarioPost extends IUsuario {
	senha: string;
}

export interface IUsuarioCadastro extends IUsuarioPost {
	confirmacao_senha: string;
}
