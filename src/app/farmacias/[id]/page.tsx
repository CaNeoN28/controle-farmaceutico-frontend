"use client";

import Menu from "@/components/Menu";
import FarmaciaFetch from "@/fetch/farmacias";
import Farmacia from "@/types/Farmacia";
import { useEffect, useState } from "react";
import styles from "./Farmacia.module.scss"
import TituloFarmacia from "@/components/TituloFarmacia";
import Map from "@/components/Map";
import Botao from "@/components/Botao";


interface Params {
	id: string;
}

export default function Farmacia({ params }: { params: Params }) {
	const { id: farmaciaId } = params;

	const fFarmacias = new FarmaciaFetch();

	const [farmacia, setFarmacia] = useState<Farmacia>();
	const [erroFarmacia, setErroFarmacia] = useState("");

	const getFarmacia = () => {
		fFarmacias
			.getFarmacia(farmaciaId)
			.then((res) => {
				const resposta = res.data as Farmacia;

				setFarmacia(resposta);
			})
			.catch((err) => {
				setErroFarmacia(`Não foi possível encontrar farmácia`);
			});
	};

	useEffect(() => {
		getFarmacia();
	}, []);

	return (
		<>
			<Menu />
			{farmacia ? (
				<main className={styles.main}>
					<div className={styles.farmacia}>
						<div className={styles.localizacao}>
							<Map/>
							<TituloFarmacia/>
						</div>
						<Botao fullWidth>Traçar rota</Botao>
					</div>
					<div className={styles.informacoes}>
						<div className={styles.container}></div>
						<div className={styles.container}></div>
					</div>
				</main>
			) : (
				<span>{erroFarmacia}</span>
			)}
		</>
	);
}
