"use client";

import Menu from "@/components/Menu";
import React, { useEffect } from "react";
import "./globals.css";
import styles from "./Home.module.scss";
import TituloFarmacia from "@/components/TituloFarmacia";
import Botao from "@/components/Botao";
import FarmaciaItem from "@/components/FarmaciaItem";
import FarmaciaFetch from "@/fetch/farmacias";

export default function Home() {
	const fFarmacias = new FarmaciaFetch();

	const getFarmacia = () => {
		fFarmacias
			.getFarmaciasProximas({ limite: 5, latitude: 0, longitude: 0 })
			.then((res) => {
				console.log(res);
			});
	};

	useEffect(() => {
		getFarmacia();
	}, []);

	return (
		<>
			<Menu />
			<main className={styles.main}>
				<div className={styles.farmacia_proxima}>
					<div className={styles.farmacia}>
						<div className={styles.map}></div>
						<TituloFarmacia>
							<div className={styles.info}>
								<span>Farmácia são José</span>
								<span>Farmácia aberta mais próxima</span>
							</div>
						</TituloFarmacia>
					</div>
					<Botao fullWidth onClick={() => {}}>
						Traçar Rota
					</Botao>
				</div>
				<div className={styles.farmacias}>
					<div className={styles.listagem}>
						<span className={styles.title}>Outras farmácias abertas</span>
						<div className={styles.items}>
							{[1, 2, 3, 4, 5, 6].map((v) => (
								<FarmaciaItem
									key={v}
									informacao="07:00 - 17:00"
									nome="Farmácia"
									para=""
								/>
							))}
						</div>
						<Botao secundario fullWidth>
							Ver mais
						</Botao>
					</div>
					<div className={styles.listagem}>
						<span className={styles.title}>Plantões nos próximos dias</span>
						<div className={styles.items}>
							{[1, 2, 3, 4, 5, 6].map((v) => (
								<FarmaciaItem
									key={v}
									informacao="24/10/2024"
									nome="Farmácia"
									para=""
								/>
							))}
						</div>
						<Botao secundario fullWidth>
							Ver mais
						</Botao>
					</div>
				</div>
			</main>
		</>
	);
}
