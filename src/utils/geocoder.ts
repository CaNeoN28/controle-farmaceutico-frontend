import Endereco from "@/types/Endereco";
import { Coordenadas } from "@/types/Localizacao";
import { Loader } from "@googlemaps/js-api-loader";
import axios from "axios";

const OPEN_WEATHER = process.env.NEXT_PUBLIC_OPEN_WEATHER || "";

export async function EncontrarCoordenada(endereco: {
	estado?: string;
	municipio?: string;
}) {
	const { estado, municipio } = endereco;
	let map_center: Coordenadas = { lat: 0, lng: 0 };

	if (estado && municipio)
		await axios
			.get(
				`http://api.openweathermap.org/geo/1.0/direct?q=${municipio},${estado},BR&limit=1&appid=${OPEN_WEATHER}`
			)
			.then((res) => {
				const [data] = res.data as { lat: number; lon: number }[];

				map_center = {
					lat: data.lat,
					lng: data.lon,
				};
			})
			.catch((err) => {
				console.log(err);
			});

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
