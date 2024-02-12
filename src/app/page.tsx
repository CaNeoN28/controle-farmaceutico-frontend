"use client";

import Menu from "@/components/Menu";
import React from "react";
import "./globals.css";
import styles from "./Home.module.scss";
import TituloFarmacia from "@/components/TituloFarmacia";
import Botao from "@/components/Botao";
import { redirect } from "next/dist/server/api-utils";

export default function Home() {
	return (
		<>
			<Menu />
			<main className={styles.main}>
				<div className={styles.farmacia_proxima}>
					<div className={styles.map}></div>
					<TituloFarmacia>
						<span>Farmácia são José</span>
						<span>Farmácia aberta mais próxima</span>
					</TituloFarmacia>
					<Botao fullWidth onClick={() => {}}>Traçar Rota</Botao>
				</div>
				<div className={styles.farmacias}>
					<div className={styles.listagem}></div>
					<div className={styles.listagem}></div>
				</div>
			</main>
		</>
	);
}
