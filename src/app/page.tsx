"use client";

import Menu from "@/components/Menu";
import React from "react";
import "./globals.css";
import styles from "./Home.module.scss";
import TituloFarmacia from "@/components/TituloFarmacia";
import Botao from "@/components/Botao";
import { redirect } from "next/dist/server/api-utils";
import FarmaciaItem from "@/components/FarmaciaItem";

export default function Home() {
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
								<FarmaciaItem informacao="24/10/2024" nome="Farmácia" para="" />
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
