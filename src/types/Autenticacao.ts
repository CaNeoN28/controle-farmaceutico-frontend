import IUsuario from "./Usuario";

export interface ILogin {
	nome_usuario: string;
	senha: string;
}

export interface ILoginResponse {
	token: string;
	usuario: IUsuario;
}
