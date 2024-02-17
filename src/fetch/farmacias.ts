import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const url = `${API_URL}/farmacias`;

interface ParamsProximas {
	pagina?: number;
	limite?: number;
	latitude: number;
	longitude: number;
	tempo?: Date;
}

interface ParamsPlantoes {
	pagina?: number;
	limite?: number;
	municipio?: string;
	estado?: string;
	tempo?: Date;
}

interface FiltrosFarmacias {
	bairro?: string;
	estado?: string;
	municipio?: string;
	nome_fantasia?: string;
	pagina?: number;
	limite?: number;
}

export default class FarmaciaFetch {
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

	getFarmaciasPlantoes(params: ParamsPlantoes) {
		const response = axios.get(`${url}/plantao`, {
			params,
		});

		return response;
	}

	getFarmaciasProximas(params: ParamsProximas) {
		const response = axios.get(`${url}/proximas`, {
			params,
		});

		return response;
	}
}
