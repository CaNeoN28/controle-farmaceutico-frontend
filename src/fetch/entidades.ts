import IEntidade from "@/types/Entidades";
import { FiltrosEntidade } from "@/types/fetchEntidades";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const url = `${API_URL}/entidades`;

export default class FetchEntidades {
	getEntidades(filtros: FiltrosEntidade) {
		const response = axios.get(url, {
			params: filtros,
		});

		return response;
	}

	getEntidade(id?: string) {
		const response = axios.get(`${API_URL}/entidade/${id}`);

		return response;
	}

	postEntidade(data?: IEntidade, token?: string) {
		const response = axios.post(`${API_URL}/entidade`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response;
	}

	putEntidade(id: string, data?: IEntidade, token?: string) {
		const response = axios.put(`${API_URL}/entidade/${id}`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response;
	}

	deleteEntidade(id: string, token?: string) {
		const response = axios.delete(`${API_URL}/entidade/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response;
	}
}
