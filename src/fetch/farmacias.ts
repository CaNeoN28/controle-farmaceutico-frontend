import axios from "axios";

const { API_URL } = process.env;
const url = `http://localhost:3030/farmacias`;

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

export default class FarmaciaFetch {
	getFarmacias(params: any) {
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
