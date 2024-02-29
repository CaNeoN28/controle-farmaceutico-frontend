import { Opcao } from "@/components/Select";
import { fetchEstados, fetchMunicipios } from "@/fetch/localizacao";
import { Dispatch, SetStateAction } from "react";
import { getSiglaFromEstado } from "./estadosParaSigla";

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

export async function getOpcoesFromMunicipios(
	estado: string,
	filtroMunicipio: string,
	setMunicipios: Dispatch<SetStateAction<Opcao[]>>
) {
	const siglaEstado = getSiglaFromEstado(estado);

	await fetchMunicipios(siglaEstado).then((res) => {
		const municipios = res.data;

		const fMunicipios: Opcao[] = municipios
			.filter((m) => new RegExp(filtroMunicipio, "i").test(m.nome))
			.sort((a, b) => (a.nome > b.nome ? 1 : -1))
			.map((m) => {
				return {
					label: m.nome,
					valor: m.nome,
				};
			});

		setMunicipios(fMunicipios);
	});
}
