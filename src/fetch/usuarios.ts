import { IUsuarioAPI } from "@/types/Usuario";
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

export function getUsuario(id: string, token?: string) {
  const response = axios.get(`${API_URL}/usuario/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export function postUsuario(dados: IUsuarioAPI, token?: string) {
  const response = axios.post(`${API_URL}/usuario`, dados, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export function putUsuario(id: string, dados: IUsuarioAPI, token?: string) {
  const response = axios.put(`${API_URL}/usuario/${id}`, dados, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response
}

export function deleteUsuario(id: string, token?: string) {
  const response = axios.delete(`${API_URL}/usuario/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}
