import { DadosCep, Estado, Municipio } from "@/types/Localizacao";
import axios, { AxiosPromise } from "axios";

const API_IBGE = "https://servicodados.ibge.gov.br/api/v1";
const API_VIACEP = "https://viacep.com.br/ws";

export async function getDadosCep(cep: string) {
	const response = axios.get(`${API_VIACEP}/${cep}/json`);

	return response as AxiosPromise<DadosCep>;
}

export async function getEstadoFromSigla(sigla: string) {
	const response = axios.get(`${API_IBGE}/localidades/estados/${sigla}`);

	return response as AxiosPromise<Estado>;
}

export async function fetchEstados() {
	const response = axios.get(`${API_IBGE}/localidades/estados`);

	return response as AxiosPromise<Estado[]>;
}

export async function fetchMunicipios(siglaEstado: string) {
	const response = axios.get(`${API_IBGE}/localidades/estados/${siglaEstado}/municipios`);

	return response as AxiosPromise<Municipio[]>;
}