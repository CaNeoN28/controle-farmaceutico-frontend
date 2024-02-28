import { IUsuarioAPI } from "@/types/Usuario";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function postUsuario(dados: IUsuarioAPI, token?: string) {
  const response = axios.post(`${API_URL}/usuario`, dados, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response
}
