import axios from "axios";

const { API_URL } = process.env;
const url = `http://localhost:3030/farmacias`;

interface ParamsProximas {
	pagina?: number;
	limite?: number;
	latitude: number;
	longitude: number;
}

export default class FarmaciaFetch {
	getFarmacias(params: any) {
		const response = axios.get(url, {
			params,
		});

		return response;
	}

	getFarmaciasPlantoes(params: any) {
		const response = axios.get(`${url}/plantoes`, {
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
