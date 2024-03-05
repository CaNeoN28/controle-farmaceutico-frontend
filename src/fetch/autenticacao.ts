import { IUsuarioAPI, IUsuarioPost, IUsuarioPut } from "@/types/Usuario";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const url = `${API_URL}`;

export default class FetchAutenticacao {
	getPerfil(token?: string) {
		const response = axios.get(`${url}/perfil`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		return response;
	}

	updatePerfil(data: IUsuarioPut, token?: string) {
		const response = axios.put(`${url}/perfil/atualizar`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response;
	}

	postCadastro(data: IUsuarioAPI) {
		const response = axios.post(`${url}/cadastro`, data);

		return response;
	}

	postLogin({ nome_usuario, senha }: { nome_usuario: string; senha: string }) {
		const response = axios.post(`${url}/login`, {
			nome_usuario,
			senha,
		});

		return response;
	}

	esqueciSenha(email: string) {
		const response = axios.post(`${API_URL}/esqueceu-senha`, { email });

		return response;
	}

	verificarToken(token?: string) {
		const response = axios.get(`${API_URL}/verificar-token`, {
			headers: {
				Authorization: token,
			},
		});

		return response;
	}

	recuperarSenha(token: string, senha: string) {
		const response = axios.put(
			`${API_URL}/recuperar-senha`,
			{
				senha,
			},
			{
				headers: {
					Authorization: token,
				},
			}
		);

		return response;
	}
}
