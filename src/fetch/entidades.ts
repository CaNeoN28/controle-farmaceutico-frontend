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
}
