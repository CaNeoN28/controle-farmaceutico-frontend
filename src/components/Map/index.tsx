import { useLoadScript, GoogleMap } from "@react-google-maps/api";
import { useMemo } from "react";
import styles from "./Map.module.scss";

interface Props {
	map_center?: {
		lat: number;
		lng: number;
	};
}

export default function Map({ map_center }: Props) {
	const center = useMemo(
		() => ({ lat: map_center?.lat || 0.0, lng: map_center?.lng || 0.0 }),
		[]
	);

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
	});

	if (!isLoaded) {
		return <span>Carregando...</span>;
	}

	return (
		<GoogleMap center={center} zoom={18} mapContainerClassName={styles.map} />
	);
}
