import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const url = `${API_URL}/imagem`;

export default class FetchImagem {
	postImagem(imagens: Blob, finalidade: string) {
		const form = new FormData();

		form.append("imagem", imagens);

		const resposta = axios.post(`${API_URL}/${finalidade}/imagem`, form);

		return resposta;
	}

	confirmarImagem(
		imagens: Blob,
		finalidade: string,
		id_finalidade: string,
		caminho_imagem: string
	) {
		const form = new FormData();

		form.append("imagem", imagens);

		const resposta = axios.put(
			`${API_URL}/${finalidade}/${id_finalidade}/imagem/${caminho_imagem}`,
			form
		);

		return resposta;
	}

	removeImagem(
		finalidade: string,
		id_finalidade: string,
		caminho_imagem: string
	) {
		const resposta = axios.delete(
			`${API_URL}/${finalidade}/${id_finalidade}/imagem/${caminho_imagem}`
		);

		return resposta;
	}
}
