import { DadosCep } from "@/types/Localizacao";
import axios, { AxiosPromise } from "axios";

const API_IBGE = "https://servicodados.ibge.gov.br/api/v1";
const API_VIACEP = "https://viacep.com.br/ws";

export async function getDadosCep(cep: string) {
	const response = axios.get(`${API_VIACEP}/${cep}/json`);

	return response as AxiosPromise<DadosCep>
}
