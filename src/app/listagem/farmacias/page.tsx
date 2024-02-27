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
import IFarmacia from "@/types/Farmacia";
import FetchFarmacia from "@/fetch/farmacias";
import { GetManyRequest } from "@/types/Requests";
import CardFarmacia from "@/components/CardFarmacia";
import InputPesquisa from "@/components/InputPesquisa";
import Paginacao from "@/components/Paginacao";
import { getDayFromNum } from "@/types/DiasSemana";
import Carregando from "@/components/Carregando";
import geocodeSetDefaults from "@/utils/geocodeSetDefaults";
import getMunicipioEstado from "@/utils/getMunicipioEstadoFromLatLng";
import Listagem from "@/components/Listagem";
import { Coordenadas } from "@/types/Localizacao";
import farmaciaEstaAberta from "@/utils/farmaciaEstaAberta";

interface FarmaciaEHorario extends IFarmacia {
	aberto_hoje: boolean;
	entrada?: string;
	saida?: string;
}

export default function Farmacias() {
	const farmaciaFetch = new FetchFarmacia();

	const [data] = useState(new Date());

	const [position, setPosition] = useState<Coordenadas>();
	const [pesquisa, setPesquisa] = useState("");
	const [pagina, setPagina] = useState(1);
	const [paginaMax, setPaginaMax] = useState(5);
	const [limite, setLimite] = useState<number>();

	const [farmacias, setFarmacias] = useState<FarmaciaEHorario[]>([]);
	const [erro, setErro] = useState("");

	const getFarmacias = async () => {
		if (limite) {
			const filtros: { [key: string]: string | number } = {
				pagina,
				limite,
			};

			if (position) {
				const { erro, estado, municipio } = await getMunicipioEstado(position);

				if (erro) setErro(erro);

				if (municipio) filtros.municipio = municipio;
				if (estado) filtros.estado = estado;
			}

			if (pesquisa) {
				filtros.nome_fantasia = pesquisa;
			}

			await farmaciaFetch
				.getFarmacias(filtros)
				.then((res) => {
					const response = res.data as GetManyRequest<IFarmacia[]>;
					const farmacias = response.dados.map((f) => {
						const dia_semana = getDayFromNum(data.getDay());

						if (f.horarios_servico) {
							const horario = f.horarios_servico[dia_semana];

							const aberto_hoje = farmaciaEstaAberta(f, data);

							if (aberto_hoje) {
								return {
									...f,
									aberto_hoje: true,
									entrada: horario && horario.horario_entrada,
									saida: horario && horario.horario_saida,
								};
							}
						}

						return {
							...f,
							aberto_hoje: false,
						};
					});

					if (farmacias.length > 0) {
						setPaginaMax(response.paginas_totais);
						setErro("");
					} else {
						setErro("Não foram encontradas farmácias");
					}

					setFarmacias(farmacias);
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
					setErro("Não foi possível determinar sua localização");
				}
			);
		} else {
			setErro("Localização não é permitida pelo seu navegador");
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

		geocodeSetDefaults();

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
						<Listagem>
							{farmacias.map((f) => (
								<CardFarmacia
									key={f._id}
									nome={f.nome_fantasia}
									imagem_url={f.imagem_url || ""}
									informacao={
										f.aberto_hoje
											? f.entrada && f.saida
												? `${f.entrada} - ${f.saida}`
												: "Aberta no sistema de plantões"
											: "Fechado hoje"
									}
									link_farmacia={`/farmacias/${f._id}`}
								/>
							))}
						</Listagem>
						<Paginacao
							pagina={pagina}
							paginaMax={paginaMax}
							setPagina={setPagina}
						/>
					</>
				) : erro ? (
					<div className={styles.erro}>{erro}</div>
				) : (
					<Carregando />
				)}
			</main>
		</>
	);
}
