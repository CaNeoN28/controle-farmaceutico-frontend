import { fetchMunicipios } from "@/fetch/localizacao";
import { getSiglaFromEstado } from "./estadosParaSigla";

export default async function municipioExiste(
	estado: string,
	municipio: string
) {
	const sigla = getSiglaFromEstado(estado);

	let existe = false;

	await fetchMunicipios(sigla).then((res) => {
		const municipios = res.data;

		existe = !!municipios.find((m) => m.nome === municipio);
	});

	return existe;
}
