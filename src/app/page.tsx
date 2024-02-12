"use client";

import Menu from "@/components/Menu";
import React, { useEffect, useState } from "react";
import "./globals.css";
import styles from "./Home.module.scss";
import TituloFarmacia from "@/components/TituloFarmacia";
import Botao from "@/components/Botao";
import FarmaciaItem from "@/components/FarmaciaItem";
import FarmaciaFetch from "@/fetch/farmacias";

export default function Home() {
	const fFarmacias = new FarmaciaFetch();

	const [farmaciaMaisProxima, setFarmaciaMaisProxima] = useState<any>();
	const [farmaciasProximas, setFarmaciasProximas] = useState<any[]>([]);
	const [farmaciasEscala, setFarmaciasEscala] = useState<any[]>([]);

	const getFarmacias = () => {
		fFarmacias
			.getFarmaciasProximas({ limite: 6, latitude: 0, longitude: 0 })
			.then((res) => {
				const farmacias = res.data.dados as any[];
				setFarmaciaMaisProxima(farmacias[0]);
				setFarmaciasProximas(farmacias.slice(1, 6));
			});
	};

	useEffect(() => {
		getFarmacias();
	}, []);

	return (
		<>
			<Menu />
			<main className={styles.main}>
				{farmaciaMaisProxima && (
					<div className={styles.farmacia_proxima}>
						<div className={styles.farmacia}>
							<div className={styles.map}></div>
							<TituloFarmacia>
								<div className={styles.info}>
									<span>{farmaciaMaisProxima.nome_fantasia}</span>
									<span>Farmácia aberta mais próxima</span>
								</div>
							</TituloFarmacia>
						</div>
						<Botao fullWidth onClick={() => {}}>
							Traçar Rota
						</Botao>
					</div>
				)}
				<div className={styles.farmacias}>
					<div className={styles.listagem}>
						<span className={styles.title}>Outras farmácias abertas</span>
						<div className={styles.items}>
							{farmaciasProximas.map((f, i) => (
								<FarmaciaItem
									key={i}
									informacao="07:00 - 17:00"
									nome={f.nome_fantasia}
									para={`/farmacias/${f._id}`}
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
