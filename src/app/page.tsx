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
import Farmacia, { Escala } from "@/types/Farmacia";
import { getDayFromNum } from "@/types/DiasSemana";
import Map from "@/components/Map";

export default function Home() {
	const fFarmacias = new FarmaciaFetch();

	const [date, setDate] = useState(new Date());

	const [localizacao, setLocalizacao] = useState<{
		lng: number;
		lat: number;
	}>();
	const [erroLocalizacao, setErroLocalizacao] = useState<string>();

	const [farmaciaMaisProxima, setFarmaciaMaisProxima] = useState<Farmacia>();
	const [farmaciasProximas, setFarmaciasProximas] = useState<Farmacia[]>([]);
	const [farmaciasEscala, setFarmaciasEscala] = useState<
		Array<Farmacia & { dia_semana: string }>
	>([]);

	const getFarmacias = () => {
		if (localizacao) {
			const { lat, lng } = localizacao;

			fFarmacias
				.getFarmaciasProximas({
					limite: 6,
					tempo: date,
					latitude: lat,
					longitude: lng,
				})
				.then((res) => {
					const resposta = res.data as GetManyRequest<Farmacia[]>;
					const farmacias = resposta.dados;

					setFarmaciaMaisProxima(farmacias[0]);
					setFarmaciasProximas(farmacias.slice(1, 6));
				});

			fFarmacias
				.getFarmaciasPlantoes({
					limite: 5,
					tempo: date,
				})
				.then((res) => {
					const resposta = res.data as GetManyRequest<Escala>;
					const escala = resposta.dados;

					const farmacias: Array<Farmacia & { dia_semana: string }> = [];

					Object.keys(escala).map((e) => {
						escala[e].map((f) => {
							const dia = new Date(e);

							const { d, m, y } = {
								d: String(dia.getDate()),
								m: String(dia.getMonth() + 1),
								y: String(dia.getFullYear()),
							};

							const dia_semana = `${d.padStart(2, "0")}/${m.padStart(
								2,
								"0"
							)}/${y.padStart(4, "0")}`;

							farmacias.push({
								...f,
								dia_semana,
							});
						});
					});

					setFarmaciasEscala(farmacias.slice(0, 5));
				});
		}
	};

	const getLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;

					setLocalizacao({
						lat: latitude,
						lng: longitude,
					});
				},
				(error) => {
					setErroLocalizacao(error.message);

					setLocalizacao({
						lat: 0,
						lng: 0,
					});
				}
			);
		} else {
			setErroLocalizacao("Geolocalização não permitida no navegador");
		}
	};

	useEffect(() => {
		getLocation();
	}, []);

	useEffect(() => {
		getFarmacias();
	}, [localizacao]);

	if (farmaciaMaisProxima && farmaciasEscala && farmaciasProximas)
		return (
			<>
				<Menu />
				<main className={styles.main}>
					{farmaciaMaisProxima && (
						<div className={styles.farmacia_proxima}>
							<div className={styles.farmacia}>
								<div className={styles.map}>
									{erroLocalizacao ? (
										<span>{erroLocalizacao}</span>
									) : (
										<Map
											map_center={{
												lat: Number(farmaciaMaisProxima.endereco.localizacao.x),
												lng: Number(farmaciaMaisProxima.endereco.localizacao.y),
											}}
										/>
									)}
								</div>
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
								{farmaciasEscala.map((f, i) => (
									<FarmaciaItem
										key={i}
										informacao={f.dia_semana}
										nome={f.nome_fantasia}
										para={`/farmacias/${f._id}`}
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
