"use client";

import Menu from "@/components/Menu";
import FarmaciaFetch from "@/fetch/farmacias";
import Farmacia from "@/types/Farmacia";
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

	const fFarmacias = new FarmaciaFetch();

	const [date, setDate] = useState(new Date());
	const [farmacia, setFarmacia] = useState<Farmacia>();
	const [localizacaoFarmacia, setLocalizacaoFarmacia] = useState({
		lat: 0,
		lng: 0,
	});
	const [horarios, setHorarios] = useState<Horario[]>([]);
	const [plantoes, setPlantoes] = useState<Plantoes>({});
	const [aberto, setAberto] = useState<boolean>(false);

	const [erroFarmacia, setErroFarmacia] = useState("");

	const getFarmacia = () => {
		fFarmacias
			.getFarmacia(farmaciaId)
			.then((res) => {
				const resposta = res.data as Farmacia;

				resposta.plantoes = resposta.plantoes.filter((p) => {
					const dataP = new Date(p);

					const hora = date.getHours();

					const dataAtual = new Date(
						[date.getFullYear(), date.getMonth() + 1, date.getDate()].join("/")
					);

					if (hora < 7) {
						return Number(dataP) + 60 * 60 * 24 * 1000 >= Number(dataAtual);
					}

					return Number(dataP) >= Number(dataAtual);
				});

				setFarmacia(resposta);
			})
			.catch((err) => {
				setErroFarmacia(`Não foi possível encontrar farmácia`);
			});
	};

	useEffect(() => {
		getFarmacia();
	}, []);

	useEffect(() => {
		if (farmacia) {
			const { x, y } = farmacia.endereco.localizacao;

			setLocalizacaoFarmacia({
				lat: Number(x),
				lng: Number(y),
			});

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
				.sort((a, b) => (Number(new Date(a)) > Number(new Date(b)) ? 1 : -1))
				.map((p) => {
					const [ano] = p.split("/");

					if (plantoes[ano] == undefined) {
						plantoes[ano] = [];
					}

					plantoes[ano].push(p);
				});

			setPlantoes(plantoes);

			const aberto = farmaciaEstaAberta(farmacia, date);
			setAberto(aberto);
		}
	}, [farmacia]);

	return (
		<>
			<Menu />
			{farmacia ? (
				<main className={styles.main}>
					<div className={styles.farmacia}>
						<div className={styles.informacao_principal}>
							<div className={styles.map}>
								<Map map_center={localizacaoFarmacia} />
							</div>
							<TituloFarmacia>
								<div className={styles.titulo}>
									<span>{farmacia.nome_fantasia}</span>
									<span>{aberto ? "Aberto agora" : "Fechado agora"}</span>
								</div>
							</TituloFarmacia>
						</div>
						<Botao fullWidth>Traçar rota</Botao>
					</div>
					<div className={styles.informacoes}>
						<div className={styles.secao}>
							<span>Horário de funcionamento:</span>
							<div className={styles.container}>
								<div className={styles.horarios}>
									{horarios.map((h) => (
										<HorarioServicoView key={h.dia_semana} {...h} />
									))}
								</div>
							</div>
						</div>
						<div className={styles.secao}>
							<span>Escala de plantão:</span>
							<div className={styles.container}>
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
			) : (
				<span>{erroFarmacia}</span>
			)}
		</>
	);
}
