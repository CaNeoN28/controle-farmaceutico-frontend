import { IUsuarioAPI } from "@/types/Usuario";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const url = `${API_URL}`;

export default class FetchAutenticacao {
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
}
