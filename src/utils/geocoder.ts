import { Coordenadas } from "@/types/Localizacao";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export async function EncontrarCoordenada(endereco: {
	estado?: string;
	municipio?: string;
}) {
	const { estado, municipio } = endereco;

	const response = await fetch(
		`${SITE_URL}api/geocoding?estado=${estado}&municipio=${municipio}`
	);

	const map_center = await response.json() as Coordenadas
	/* const loader = new Loader({
		apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
	});

	const map_center = await loader.load().then(async () => {
		const { Geocoder } = (await google.maps.importLibrary(
			"geocoding"
		)) as google.maps.GeocodingLibrary;

		const geocoder = new Geocoder();

		const pesquisa = [
			cep,
			estado,
			municipio,
			bairro,
			logradouro,
			numero,
			nome_farmacia,
		].join(" ");

		let map_center: Coordenadas = { lat: 0, lng: 0 };

		await geocoder
			.geocode({ address: pesquisa })
			.then((res) => {
				const resultado = res.results[0].geometry.location.toJSON();

				if (
					resultado.lat != map_center?.lat &&
					resultado.lng != map_center?.lng
				) {
					map_center = resultado;
				}
			})
			.catch(() => {});

		return map_center;
	});

	return map_center; */

	return map_center;
}
