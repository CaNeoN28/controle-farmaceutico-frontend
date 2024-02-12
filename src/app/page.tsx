"use client";

import Menu from "@/components/Menu";
import React, { useEffect, useState } from "react";
import "./globals.css";
import styles from "./Home.module.scss";
import TituloFarmacia from "@/components/TituloFarmacia";
import Botao from "@/components/Botao";
import FarmaciaItem from "@/components/FarmaciaItem";
import FarmaciaFetch from "@/fetch/farmacias";
import { GetManyRequest } from "@/types/Requests";
import Farmacia from "@/types/Farmacia";
import { getDayFromNum } from "@/types/DiasSemana";

export default function Home() {
	const fFarmacias = new FarmaciaFetch();

	const [date, setDate] = useState(new Date());

	const [farmaciaMaisProxima, setFarmaciaMaisProxima] = useState<any>();
	const [farmaciasProximas, setFarmaciasProximas] = useState<Farmacia[]>([]);
	const [farmaciasEscala, setFarmaciasEscala] = useState<any[]>([]);

	const getFarmacias = () => {
		fFarmacias
			.getFarmaciasProximas({
				limite: 6,
				tempo: date,
				latitude: 0,
				longitude: 0,
			})
			.then((res) => {
				const resposta = res.data as GetManyRequest<Farmacia>;
				const farmacias = resposta.dados;

				setFarmaciaMaisProxima(farmacias[0]);
				setFarmaciasProximas(farmacias.slice(1, 6));
			});
	};

	useEffect(() => {
		getFarmacias();
	}, []);

	if (farmaciaMaisProxima && farmaciasEscala && farmaciasProximas)
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
								{farmaciasProximas.map((f, i) => {
									const dia = f.horarios_servico[getDayFromNum(date.getDay())];

									return (
										<FarmaciaItem
											key={i}
											informacao={`${dia.horario_entrada} - ${dia.horario_saida}`}
											nome={f.nome_fantasia}
											para={`/farmacias/${f._id}`}
										/>
									);
								})}
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

	return <></>;
}
