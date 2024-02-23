// import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
// import { useMemo } from "react";
// import usePlacesAutocomplete from "use-places-autocomplete";
import styles from "./Map.module.scss";
import { Loader } from "@googlemaps/js-api-loader";
import { Coordenadas } from "@/types/Localizacao";
import { Dispatch, SetStateAction } from "react";

interface Props {
	map_center?: Coordenadas;
	map_options?: google.maps.MapOptions;
	setLocalizacao?: Dispatch<SetStateAction<Coordenadas>>;
}

export default function Map(props: Props) {
	const { map_center, setLocalizacao } = props;

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
	});

	/* if (!isLoaded) {
		return <span>Carregando...</span>;
	}

	return (
		<GoogleMap
			options={mapOptions}
			center={mapCenter}
			zoom={14}
			mapContainerClassName={styles.map}
		></GoogleMap>
	); */

	return <div id="google_map" className={styles.map} />;
}
