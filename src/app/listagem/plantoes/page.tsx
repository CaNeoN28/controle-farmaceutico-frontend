"use client";

import Menu from "@/components/Menu";
import styles from "./Plantoes.module.scss";
import { useEffect, useState } from "react";
import { Escala } from "@/types/Farmacia";
import Listagem from "@/components/Listagem";
import Paginacao from "@/components/Paginacao";
import CardFarmacia from "@/components/CardFarmacia";
import FetchFarmacia from "@/fetch/farmacias";
import { GetManyRequest } from "@/types/Requests";
import Secao from "@/components/Secao";
import { FiltrosPlantoes } from "@/types/fetchFarmacias";
import getMunicipioEstado from "@/utils/getMunicipioEstadoFromLatLng";
import Carregando from "@/components/Carregando";
import converterData from "@/utils/converterData";
import { Coordenadas } from "@/types/Localizacao";

export default function Plantoes() {
	const fFarmacias = new FetchFarmacia();

	const [date] = useState(new Date());

	const [position, setPosition] = useState<Coordenadas>();
	const [erroPosition, setErroPosition] = useState("");

	const [pagina, setPagina] = useState(1);
	const [paginaMax, setPaginaMax] = useState(5);
	const [erroEscala, setErroEscala] = useState("");

	const [escala, setEscala] = useState<Escala>({});

	const getLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(
				(position) => {
					const { latitude, longitude } = position.coords;

					setErroPosition("");
					setPosition({
						lat: latitude,
						lng: longitude,
					});
				},
				(err) => {
					console.log(err);
					setErroPosition("Não foi possível determinar sua localização");
				}
			);
		} else {
			setErroPosition("Localização não é permitida pelo seu navegador");
		}
	};

	const getFarmacias = async () => {
		const filtros: FiltrosPlantoes = { pagina, limite: 10, tempo: date };

		if (position) {
			const { erro, estado, municipio } = await getMunicipioEstado(position);

			if (estado) filtros.estado = estado;
			if (municipio) filtros.municipio = municipio;
		}

		await fFarmacias
			.getFarmaciasPlantoes(filtros)
			.then((res) => {
				const resposta = res.data as GetManyRequest<Escala>;
				const { paginas_totais, dados: escala } = resposta;

				setEscala(escala);
				setPaginaMax(paginas_totais);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getLocation();
	});

	useEffect(() => {
		getFarmacias();
	}, [position]);

	useEffect(() => {
		getFarmacias();
	}, [pagina]);

	return (
		<>
			<Menu />
			<main className={styles.main}>
				{escala && Object.keys(escala).length > 0 ? (
					<>
						<div className={styles.secoes}>
							{Object.keys(escala).map((v: keyof Escala, i) => {
								return (
									<div className={styles.secao} key={i}>
										<Secao titulo={converterData(v)}>
											<div className={styles.farmacias}>
												<Listagem>
													{escala[v].map((f, i) => {
														return (
															<CardFarmacia
																key={i}
																nome={f.nome_fantasia}
																imagem_url={f.imagem_url || ""}
																link_farmacia={`/farmacias/${f._id}`}
															/>
														);
													})}
												</Listagem>
											</div>
										</Secao>
									</div>
								);
							})}
						</div>
						<Paginacao
							pagina={pagina}
							setPagina={setPagina}
							paginaMax={paginaMax}
						/>
					</>
				) : erroEscala ? (
					<div className={styles.erro}>{erroEscala}</div>
				) : (
					<Carregando />
				)}
			</main>
		</>
	);
}
