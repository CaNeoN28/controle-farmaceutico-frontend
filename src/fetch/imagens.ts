import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const url = `${API_URL}/imagem`;

export default class FetchImagem {
	postImagem(imagens: Blob) {
		const form = new FormData();

		form.append("imagem", imagens);

		const resposta = axios.post(url, form);

		return resposta;
	}
}
