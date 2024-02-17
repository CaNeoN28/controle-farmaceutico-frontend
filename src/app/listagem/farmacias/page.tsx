"use client";

import Menu from "@/components/Menu";
import styles from "./Farmacias.module.scss";
import { useEffect, useState } from "react";
import Farmacia from "@/types/Farmacia";
import FarmaciaFetch from "@/fetch/farmacias";
import { GetManyRequest } from "@/types/Requests";

export default function Farmacias() {
	const farmaciaFetch = new FarmaciaFetch();

	const [position, setPosition] = useState<Localizacao>();
	const [farmacias, setFarmacias] = useState<Farmacia[]>([]);

	const getFarmacias = () => {
		if (position) {
			farmaciaFetch.getFarmacias({}).then((res) => {
				const response = res.data as GetManyRequest<Farmacia[]>;
				const farmacias = response.dados;

				console.log(response)
			});
		}
	};

	const getPosition = () => {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(
				(position) => {
					const { latitude, longitude } = position.coords;

					setPosition({
						lat: latitude,
						lng: longitude,
					});
				},
				(error) => {
					console.log(error);
				}
			);
		} else {
			console.log("Não foi possível encontrar localização");
		}
	};

	useEffect(() => {
		getPosition();
	}, []);

	useEffect(() => {
		getFarmacias()
	}, [position]);

	return (
		<>
			<Menu />
		</>
	);
}
