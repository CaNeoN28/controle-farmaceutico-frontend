"use client";

import Menu from "@/components/Menu";
import React, { useEffect, useLayoutEffect, useState } from "react";
import "./globals.css";
import { fromLatLng } from "react-geocode";
import styles from "./Home.module.scss";
import TituloFarmacia from "@/components/TituloFarmacia";
import Botao from "@/components/Botao";
import FarmaciaItem from "@/components/FarmaciaItem";
import FarmaciaFetch from "@/fetch/farmacias";
import { GetManyRequest } from "@/types/Requests";
import Farmacia, { Escala } from "@/types/Farmacia";
import { getDayFromNum } from "@/types/DiasSemana";
import Map from "@/components/Map";
import Carregando from "@/components/Carregando";
import geocodeSetDefaults from "@/utils/geocodeSetDefaults";
import getMunicipioEstado from "@/utils/getMunicipioEstadoFromLatLng";
import { FiltrosFarmaciasProximas } from "@/utils/fetchFarmacias";

interface Localizacao {
	lng: number;
	lat: number;
}

type FarmaciaEscala = Array<Farmacia & { dia_semana: string }>;

export default function Home() {
	const fFarmacias = new FarmaciaFetch();

	const [date] = useState(new Date());

	const [localizacao, setLocalizacao] = useState<Localizacao>();
	const [erroLocalizacao, setErroLocalizacao] = useState<string>();

	const [farmaciaMaisProxima, setFarmaciaMaisProxima] = useState<Farmacia>();
	const [farmaciasProximas, setFarmaciasProximas] = useState<Farmacia[]>([]);
	const [farmaciasProximasF, setFarmaciasProximasF] = useState<Farmacia[]>([]);
	const [erroFarmaciasProximas, setErroFarmaciasProximas] = useState("");

	const [farmaciasEscala, setFarmaciasEscala] = useState<FarmaciaEscala>([]);
	const [farmaciasEscalaF, setFarmaciasEscalaF] = useState<FarmaciaEscala>([]);
	const [erroFarmaciasEscala, setErroFarmaciasEscala] = useState("");

	const [numFarmacias, setNumFarmacias] = useState<number>(5);

	const getFarmacias = async () => {
		let localizacao: Localizacao | undefined = undefined;

		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(
				(position) => {
					const { latitude, longitude } = position.coords;

					localizacao = {
						lat: latitude,
						lng: longitude,
					};

					setLocalizacao(localizacao);
				},
				(error) => {
					console.log(error);
					setErroLocalizacao("Não foi possível rastrear sua localização");
				}
			);
		} else {
			setErroLocalizacao("Geolocalização não permitida no navegador");
		}

		if (localizacao) {
			const { lat, lng } = localizacao;
			const filtros: FiltrosFarmaciasProximas = {
				limite: 6,
				tempo: date,
				latitude: lat,
				longitude: lng,
			};

			const { erro, estado, municipio } = await getMunicipioEstado(localizacao);

			if (erro) setErroLocalizacao(erro);

			if (estado) filtros.estado = estado;
			if (municipio) filtros.municipio = municipio;

			fFarmacias
				.getFarmaciasProximas(filtros)
				.then((res) => {
					const resposta = res.data as GetManyRequest<Farmacia[]>;
					const farmacias = resposta.dados;

					if (farmacias.length < 0) {
						setErroFarmaciasProximas(
							"Não foram encontradas farmácias abertas próximas "
						);
					} else {
						setErroFarmaciasProximas("");
						setFarmaciaMaisProxima(farmacias[0]);
					}
					setFarmaciasProximas(farmacias);
				})
				.catch((err) => {
					console.log(err);

					setErroFarmaciasProximas(
						"Não foi possível recuperar farmácias próximas"
					);
				});

			fFarmacias
				.getFarmaciasPlantoes({
					limite: numFarmacias,
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

					setFarmaciasEscala(farmacias);
					setErroFarmaciasEscala("");
				})
				.catch((err) => {
					console.log(err);

					setErroFarmaciasEscala("Não foi possível recuperar escala");
				});
		}
	};

	const tracarRota = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();

		if (localizacao && farmaciaMaisProxima) {
			const url = `https://www.google.com/maps/dir/${localizacao.lat},${localizacao.lng}/${farmaciaMaisProxima.endereco.localizacao.x},${farmaciaMaisProxima.endereco.localizacao.y}`;

			window.open(url, "_blank");
		}
	};

	useEffect(() => {
		const getMaxFarmacias = () => {
			const width = window.innerWidth;

			if (width > 1680) {
				setNumFarmacias(5);
			} else if (width > 1280) {
				setNumFarmacias(4);
			} else {
				setNumFarmacias(3);
			}
		};

		getMaxFarmacias();

		window.addEventListener("resize", getMaxFarmacias);
		return () => window.removeEventListener("resize", getMaxFarmacias);
	}, []);

	useEffect(() => {
		geocodeSetDefaults();
		getFarmacias();
	}, [numFarmacias]);

	useEffect(() => {
		setFarmaciasProximasF(farmaciasProximas.slice(1, numFarmacias + 1));
	}, [farmaciasProximas]);

	useEffect(() => {
		setFarmaciasEscalaF(farmaciasEscala.slice(0, numFarmacias));
	}, [farmaciasEscala]);

	useLayoutEffect(() => {
		setFarmaciasProximasF(farmaciasProximas.slice(1, numFarmacias + 1));
		setFarmaciasEscalaF(farmaciasEscala.slice(0, numFarmacias));
	}, [numFarmacias]);

	return (
		<>
			<Menu />
			<main className={styles.main}>
				{farmaciaMaisProxima ? (
					<div className={styles.farmacia_proxima}>
						<div className={styles.farmacia}>
							<div className={styles.map}>
								<Map
									map_center={{
										lat: Number(farmaciaMaisProxima.endereco.localizacao.x),
										lng: Number(farmaciaMaisProxima.endereco.localizacao.y),
									}}
								/>
							</div>
							<TituloFarmacia>
								<div className={styles.info}>
									<span>{farmaciaMaisProxima.nome_fantasia}</span>
									<span>Farmácia aberta mais próxima</span>
								</div>
							</TituloFarmacia>
						</div>
						<Botao fullWidth onClick={tracarRota}>
							Traçar Rota
						</Botao>
					</div>
				) : erroLocalizacao ? (
					<span className={styles.erro}>{erroLocalizacao}</span>
				) : (
					<Carregando />
				)}
				{farmaciasProximasF.length > 0 ? (
					<div className={styles.listagem}>
						<span className={styles.title}>Outras farmácias abertas</span>
						<div className={styles.items}>
							{farmaciasProximasF.map((f, i) => {
								const dia = f.horarios_servico[getDayFromNum(date.getDay())];

								return (
									<FarmaciaItem
										key={i}
										informacao={
											dia
												? `${dia.horario_entrada} - ${dia.horario_saida}`
												: "Aberta no sistema de plantão"
										}
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
				) : (
					erroFarmaciasProximas && <span className={styles.erro} />
				)}
				{farmaciasEscalaF.length > 0 ? (
					<div className={styles.listagem}>
						<span className={styles.title}>Plantões nos próximos dias</span>
						<div className={styles.items}>
							{farmaciasEscalaF.map((f, i) => (
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
				) : (
					erroFarmaciasEscala && (
						<span className={styles.erro}>{erroFarmaciasEscala}</span>
					)
				)}
			</main>
		</>
	);
}
