"use client";

import Menu from "@/components/Menu";
import styles from "./Farmacias.module.scss";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Farmacia from "@/types/Farmacia";
import FarmaciaFetch from "@/fetch/farmacias";
import { GetManyRequest } from "@/types/Requests";
import CardFarmacia from "@/components/CardFarmacia";
import InputPesquisa from "@/components/InputPesquisa";
import Paginacao from "@/components/Paginacao";

export default function Farmacias() {
	const farmaciaFetch = new FarmaciaFetch();

	const [position, setPosition] = useState<Localizacao>();
	const [pesquisa, setPesquisa] = useState("");
	const [pagina, setPagina] = useState(1);
	const [paginaMax, setPaginaMax] = useState(5);
	const [farmacias, setFarmacias] = useState<Farmacia[]>([]);

	const getFarmacias = () => {
		if (position) {
			const filtros: { [key: string]: string | number } = {};

			if (pesquisa) {
				filtros.nome_fantasia = pesquisa;
			}

			farmaciaFetch.getFarmacias(filtros).then((res) => {
				const response = res.data as GetManyRequest<Farmacia[]>;
				const farmacias = response.dados;

				setFarmacias(farmacias);
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

	const inputProps = {
		onChange: (e: ChangeEvent<HTMLInputElement>) => {
			setPesquisa(e.target.value);
		},
		onSubmit: (e: FormEvent<HTMLFormElement> & FormEvent<HTMLInputElement>) => {
			e.preventDefault();

			getFarmacias();
		},
	};

	useEffect(() => {
		getPosition();
	}, []);

	useEffect(() => {
		getFarmacias();
	}, [position]);

	return (
		<>
			<Menu />
			<main className={styles.main}>
				<div className={styles.input_container}>
					<InputPesquisa value={pesquisa} {...inputProps} />
				</div>
				{farmacias.length > 0 && (
					<>
						<div className={styles.farmacias}>
							{farmacias.map((f) => (
								<CardFarmacia
									key={f._id}
									nome={f.nome_fantasia}
									informacao=""
									link_farmacia={`/farmacias/${f._id}`}
								/>
							))}
						</div>
						<Paginacao
							pagina={pagina}
							paginaMax={pagina}
							setPagina={setPagina}
						/>
					</>
				)}
			</main>
		</>
	);
}
