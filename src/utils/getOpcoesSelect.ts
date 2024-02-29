import { Opcao } from "@/components/Select";
import { fetchEstados } from "@/fetch/localizacao";
import { Dispatch, SetStateAction } from "react";

export async function getOpcoesFromEstados(
	filtroEstado: string,
	setEstados: Dispatch<SetStateAction<Opcao[]>>
) {
	await fetchEstados()
		.then((res) => {
			const estados = res.data;

			const fEstados: Opcao[] = estados
				.filter((e) => new RegExp(filtroEstado, "i").test(e.nome))
				.sort((a, b) => (a.nome > b.nome ? 1 : -1))
				.map((e) => {
					return {
						label: e.nome,
						valor: e.nome,
					};
				});

			setEstados(fEstados);
		})
		.catch((err) => {
			console.log(err);
		});
}
