"use client";

import Menu from "@/components/Menu";
import FetchFarmacia from "@/fetch/farmacias";
import IFarmacia from "@/types/Farmacia";
import { useEffect, useState } from "react";
import styles from "./Farmacia.module.scss";
import TituloFarmacia from "@/components/TituloFarmacia";
import Map from "@/components/Map";
import Botao from "@/components/Botao";
import DiaSemana, { getDayName } from "@/types/DiasSemana";
import HorarioServico from "@/components/HorarioServico";
import HorarioServicoView from "@/components/HorarioServicoView";
import farmaciaEstaAberta from "@/utils/farmaciaEstaAberta";
import DiaPlantao from "@/components/DiaPlantao";
import Carregando from "@/components/Carregando";
import LinkButton from "@/components/LinkButton";
import classNames from "classnames";
import { Coordenadas } from "@/types/Localizacao";

interface Params {
	id: string;
}

interface Horario {
	dia_semana: string;
	entrada: string;
	saida: string;
}

interface Plantoes {
	[ano: string]: string[];
}

export default function Farmacia({ params }: { params: Params }) {
	const { id: farmaciaId } = params;

	const fFarmacias = new FetchFarmacia();

	const [date, setDate] = useState(new Date());
	const [farmacia, setFarmacia] = useState<IFarmacia>();
	const [localizacaoUsuario, setLocalizacaoUsuario] = useState<Coordenadas>();

	const [horarios, setHorarios] = useState<Horario[]>([]);
	const [plantoes, setPlantoes] = useState<Plantoes>({});
	const [aberto, setAberto] = useState<boolean>(false);

	const [rota, setRota] = useState("");

	const [erroFarmacia, setErroFarmacia] = useState("");
	const [erroLocalizacao, setErroLocalizacao] = useState("");

	const classesContainer = classNames({
		[styles.container]: true,
		["box-shadow"]: true
	})

	const getRota = () => {
		if (farmacia) {
			const { x, y } = farmacia.endereco.localizacao;

			let rota = "";

			if (localizacaoUsuario) {
				const { lat, lng } = localizacaoUsuario;

				rota = `https://www.google.com/maps/dir/${lat},${lng}/${x},${y}`;
			} else {
				rota = `https://www.google.com/maps/dir//${x},${y}`;

				console.log(rota);
			}

			setRota(rota);
		}
	};

	const getPosition = () => {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(
				(position) => {
					const { latitude, longitude } = position.coords;

					setLocalizacaoUsuario({
						lat: latitude,
						lng: longitude,
					});
					setErroLocalizacao("");
				},
				(err) => {
					console.log(err);
					setErroLocalizacao("Não foi possível determinar sua localização");
				}
			);
		} else {
			setErroLocalizacao("Localização não é permitida pelo seu navegador");
		}
	};

	const getFarmacia = () => {
		fFarmacias
			.getFarmacia(farmaciaId)
			.then((res) => {
				const resposta = res.data as IFarmacia;

				setFarmacia(resposta);
				setErroFarmacia("");
			})
			.catch((err) => {
				setErroFarmacia(`Não foi possível encontrar farmácia`);
			});
	};

	useEffect(() => {
		getPosition();
		getFarmacia();
	}, []);

	useEffect(() => {
		if (farmacia) {
			getRota()
			
			const horarios: Horario[] = Object.keys(farmacia.horarios_servico).map(
				(v: string) => {
					const dia = v as DiaSemana;

					return {
						dia_semana: getDayName(dia),
						entrada: farmacia.horarios_servico[dia].horario_entrada,
						saida: farmacia.horarios_servico[dia].horario_saida,
					};
				}
			);

			setHorarios(horarios);

			const plantoes: Plantoes = {};

			farmacia.plantoes
				.sort((a, b) => (Number(new Date(a.entrada)) > Number(new Date(b.entrada)) ? 1 : -1))
				.map((p) => {
					const ano = new Date(p.entrada).getFullYear();

					if (plantoes[ano] == undefined) {
						plantoes[ano] = [];
					}

					plantoes[ano].push(p.entrada);
				});

			setPlantoes(plantoes);

			const aberto = farmaciaEstaAberta(farmacia, date);
			setAberto(aberto);
		}
	}, [farmacia]);

	useEffect(() => {
		console.log(rota)
	}, [rota])

	useEffect(() => {
		getRota()
	}, [localizacaoUsuario])

	return (
		<>
			<Menu />
			{farmacia ? (
				<main className={styles.main}>
					<div className={styles.farmacia}>
						<div className={styles.informacao_principal}>
							<div className={styles.map}>
								<Map
									map_center={{
										lat: Number(farmacia.endereco.localizacao.x),
										lng: Number(farmacia.endereco.localizacao.y),
									}}
								/>
							</div>
							<TituloFarmacia>
								<div className={styles.titulo}>
									<span>{farmacia.nome_fantasia}</span>
									<span>{aberto ? "Aberto agora" : "Fechado agora"}</span>
								</div>
							</TituloFarmacia>
						</div>
						{erroLocalizacao && (
							<span className={styles.erro_localizacao}>{erroLocalizacao}</span>
						)}
						<LinkButton link={rota}>Traçar rota</LinkButton>
					</div>
					<div className={styles.informacoes}>
						<div className={styles.secao}>
							<span>Horário de funcionamento:</span>
							<div className={classesContainer}>
								<div className={styles.horarios}>
									{horarios.map((h) => (
										<HorarioServicoView key={h.dia_semana} {...h} />
									))}
								</div>
							</div>
						</div>
						<div className={styles.secao}>
							<span>Escala de plantão:</span>
							<div className={classesContainer}>
								{Object.keys(plantoes).map((p) => (
									<div className={styles.plantoes} key={p}>
										<span>{p}</span>
										<div className={styles.dias_plantao}>
											{plantoes[p].map((v) => (
												<DiaPlantao key={v} data={v} />
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</main>
			) : erroFarmacia ? (
				<div className={styles.erro}>{erroFarmacia}</div>
			) : (
				<Carregando />
			)}
		</>
	);
}
