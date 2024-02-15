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

interface Params {
	id: string;
}

interface Horario {
	dia_semana: string;
	entrada: string;
	saida: string;
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
	const [erroFarmacia, setErroFarmacia] = useState("");

	const getFarmacia = () => {
		fFarmacias
			.getFarmacia(farmaciaId)
			.then((res) => {
				const resposta = res.data as Farmacia;

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
							<TituloFarmacia>{farmacia.nome_fantasia}</TituloFarmacia>
						</div>
						<Botao fullWidth>Traçar rota</Botao>
					</div>
					<div className={styles.informacoes}>
						<div className={styles.container}>
							{horarios.map((h) => (
								<HorarioServicoView key={h.dia_semana} {...h}/>
							))}
						</div>
						<div className={styles.container}></div>
					</div>
				</main>
			) : (
				<span>{erroFarmacia}</span>
			)}
		</>
	);
}
