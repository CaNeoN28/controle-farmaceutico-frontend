import { FiltrosFarmaciasProximas, FiltrosPlantoes } from "@/types/fetchFarmacias";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const url = `${API_URL}/farmacias`;

interface FiltrosFarmacias {
	bairro?: string;
	estado?: string;
	municipio?: string;
	nome_fantasia?: string;
	pagina?: number;
	limite?: number;
}

export default class FetchFarmacia {
	getFarmacia(id: string) {
		const response = axios.get(`${API_URL}/farmacia/${id}`);

		return response;
	}
	getFarmacias(params: FiltrosFarmacias) {
		const response = axios.get(url, {
			params,
		});

		return response;
	}

	getFarmaciasPlantoes(params: FiltrosPlantoes) {
		const response = axios.get(`${url}/plantao`, {
			params,
		});

		return response;
	}

	getFarmaciasProximas(params: FiltrosFarmaciasProximas) {
		const response = axios.get(`${url}/proximas`, {
			params,
		});

		return response;
	}
}
