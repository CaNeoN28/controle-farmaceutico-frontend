import { fromLatLng } from "react-geocode";
import { getEstadoFromSigla } from "./estadosParaSigla";

export default async function getMunicipioEstado(localizacao: Localizacao) {
	const { lat, lng } = localizacao;

	let municipio: string | undefined = undefined;
	let estado: string | undefined = undefined;
	let erro: string | undefined = undefined;

	await fromLatLng(lat, lng)
		.then((res) => {
			const [m, sigla] = res.plus_code.compound_code
				.split(" ")
				.slice(1, 3)
				.map((v: string) => v.replace(",", ""));

			const e = getEstadoFromSigla(sigla);

			if (e) estado = e;
			if (m) municipio = m;
		})
		.catch((err) => {
			erro = "Não foi possível rastrear seu endereço";
		});

	return {
		municipio,
		estado,
		erro,
	};
}
