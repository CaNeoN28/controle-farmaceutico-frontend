// import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
// import { useMemo } from "react";
// import usePlacesAutocomplete from "use-places-autocomplete";
import styles from "./Map.module.scss";
import { Loader } from "@googlemaps/js-api-loader";
import { Coordenadas } from "@/types/Localizacao";
import { Dispatch, SetStateAction } from "react";
import Endereco from "@/types/Endereco";

interface Props {
	map_center?: Coordenadas;
	map_options?: google.maps.MapOptions;
	endereco_pesquisa?: Endereco & { nome_farmacia: string };
	setLocalizacao?: Dispatch<SetStateAction<Coordenadas>>;
}

export default function Map(props: Props) {
	const { map_center, endereco_pesquisa, setLocalizacao } = props;

	const loader = new Loader({
		apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
	});

	let map: google.maps.Map | undefined = undefined;

	loader.load().then(async () => {
		const { Map } = (await google.maps.importLibrary(
			"maps"
		)) as google.maps.MapsLibrary;
		const { AdvancedMarkerElement } = (await google.maps.importLibrary(
			"marker"
		)) as google.maps.MarkerLibrary;
		const geocoder = new google.maps.Geocoder();

		map = new Map(document.getElementById("google_map")!, {
			zoom: 18,
			center: map_center || { lat: 0, lng: 0 },
			disableDefaultUI: true,
			mapId: "b7a7a363c50a7f5d",
		});

		let marker = new AdvancedMarkerElement({
			map,
			position: map.getCenter(),
		});

		map.addListener("click", (e: google.maps.MapMouseEvent) => {
			marker.map = null;

			marker = new AdvancedMarkerElement({
				map,
				position: e.latLng,
			});

			if (setLocalizacao && e.latLng) setLocalizacao(e.latLng.toJSON());
		});

		if (endereco_pesquisa) {
			const { cep, estado, municipio, bairro, logradouro, numero, nome_farmacia } = endereco_pesquisa;
			const pesquisa = [cep, estado, municipio, bairro, logradouro, numero, nome_farmacia].join(" ");

			geocoder
				.geocode({ address: pesquisa })
				.then((res) => {
					const resultado = res.results[0].geometry.location.toJSON();

					if (
						setLocalizacao &&
						resultado.lat != map_center?.lat &&
						resultado.lng != map_center?.lng
					) {
						setLocalizacao(resultado);
					}
				})
				.catch(() => {});
		}
	});

	return <div id="google_map" className={styles.map} />;
}
