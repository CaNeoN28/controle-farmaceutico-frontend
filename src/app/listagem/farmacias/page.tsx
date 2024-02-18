"use client";

import Menu from "@/components/Menu";
import styles from "./Farmacias.module.scss";
import {
	ChangeEvent,
	FormEvent,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import Farmacia from "@/types/Farmacia";
import FarmaciaFetch from "@/fetch/farmacias";
import { GetManyRequest } from "@/types/Requests";
import CardFarmacia from "@/components/CardFarmacia";
import InputPesquisa from "@/components/InputPesquisa";
import Paginacao from "@/components/Paginacao";
import { getDayFromNum } from "@/types/DiasSemana";
import {
	setDefaults,
	fromLatLng,
	setKey,
	setLanguage,
	setRegion,
	OutputFormat,
} from "react-geocode";
import { getEstadoFromSigla } from "@/utils/estadosParaSigla";
import Carregando from "@/components/Carregando";

interface FarmaciaEHorario extends Farmacia {
	aberto_hoje: boolean;
	entrada?: string;
	saida?: string;
}

export default function Farmacias() {
	const farmaciaFetch = new FarmaciaFetch();

	const [data] = useState(new Date());

	const [position, setPosition] = useState<Localizacao>();
	const [pesquisa, setPesquisa] = useState("");
	const [pagina, setPagina] = useState(1);
	const [paginaMax, setPaginaMax] = useState(5);
	const [limite, setLimite] = useState(10);

	const [farmacias, setFarmacias] = useState<FarmaciaEHorario[]>([]);
	const [erro, setErro] = useState("");

	const getFarmacias = async () => {
		if (position) {
			const { lat, lng } = position;

			const filtros: { [key: string]: string | number } = {
				pagina,
				limite,
			};

			await fromLatLng(lat, lng)
				.then((res) => {
					const [municipio, sigla] = res.plus_code.compound_code
						.split(" ")
						.slice(1, 3)
						.map((v: string) => v.replace(",", ""));

					const estado = getEstadoFromSigla(sigla);

					if (estado) filtros.estado = estado;
					if (municipio) filtros.municipio = municipio;
				})
				.catch((err) => {
					setErro("Não foi possível rastrear seu endereço");
				});

			if (pesquisa) {
				filtros.nome_fantasia = pesquisa;
			}

			farmaciaFetch
				.getFarmacias(filtros)
				.then((res) => {
					const response = res.data as GetManyRequest<Farmacia[]>;
					const farmacias = response.dados.map((f) => {
						const dia_semana = getDayFromNum(data.getDay());

						const horario = f.horarios_servico[dia_semana];

						if (horario) {
							return {
								...f,
								aberto_hoje: true,
								entrada: horario.horario_entrada,
								saida: horario.horario_saida,
							};
						}

						return {
							...f,
							aberto_hoje: false,
						};
					});

					if (farmacias.length > 0) {
						setPaginaMax(response.paginas_totais);
						setFarmacias(farmacias);
						setErro("");
					} else {
						setErro("Não foram encontradas farmácias");
					}
				})
				.catch((err) => {
					console.log(err);

					setErro("Não foi possível listar farmácias");
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
					setErro("Não foi possível encontrar sua localização");
				}
			);
		} else {
			setErro("Seu navegador não suporta geolocalização");
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

	const onResize = () => {
		const { innerWidth } = window;

		if (innerWidth > 1220) {
			setLimite(15);
		} else if (innerWidth > 800) {
			setLimite(12);
		} else {
			setLimite(10);
		}
	};

	useEffect(() => {
		getPosition();
		onResize();

		setDefaults({
			key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
			region: "br",
			language: "pt",
			outputFormat: OutputFormat.JSON,
		});

		window.addEventListener("resize", onResize);

		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	useEffect(() => {
		getFarmacias();
	}, [position]);

	useLayoutEffect(() => {
		getFarmacias();
	}, [pagina, limite]);

	return (
		<>
			<Menu />
			<main className={styles.main}>
				<div className={styles.input_container}>
					<InputPesquisa value={pesquisa} {...inputProps} />
				</div>
				{farmacias.length > 0 ? (
					<>
						<div className={styles.farmacias}>
							{farmacias.map((f) => (
								<CardFarmacia
									key={f._id}
									nome={f.nome_fantasia}
									informacao={
										f.aberto_hoje ? `${f.entrada} - ${f.saida}` : "Fechado hoje"
									}
									link_farmacia={`/farmacias/${f._id}`}
								/>
							))}
						</div>
						<Paginacao
							pagina={pagina}
							paginaMax={paginaMax}
							setPagina={setPagina}
						/>
					</>
				) : erro ? (
					<span>{erro}</span>
				) : (
					<Carregando/>
				)}
			</main>
		</>
	);
}
