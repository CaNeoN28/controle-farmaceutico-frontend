"use client";

import Menu from "@/components/Menu";
import styles from "./Farmacias.module.scss";
import { useEffect, useState } from "react";

export default function Farmacias() {
	const [position, setPosition] = useState({ lat: 0, lng: 0 });

	const getPosition = () => {
		if(navigator.geolocation){
			navigator.geolocation.watchPosition((position) => {
				const { latitude, longitude } = position.coords;
	
				setPosition({
					lat: latitude,
					lng: longitude,
				});
			}, (error) => {
				console.log(error)
			});
		} else {
			console.log("Não foi possível encontrar localização")
		}
	};

	useEffect(() => {
		getPosition();
	}, []);

	useEffect(() => {
		console.log(position)
	}, [position])

	return (
		<>
			<Menu />
		</>
	);
}
