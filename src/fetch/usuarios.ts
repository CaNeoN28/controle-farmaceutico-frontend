import axios from "axios";

interface FiltrosUsuario {
	pagina?: number;
	limite?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function getUsuarios(filtros: FiltrosUsuario, token: string) {
	const response = axios.get(`${API_URL}/usuarios`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: filtros,
	});

	return response;
}

export function deleteUsuario(id: string, token?: string) {
	const response = axios.delete(`${API_URL}/usuario/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	return response;
}
