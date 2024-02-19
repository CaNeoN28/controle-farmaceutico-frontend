"use client";

import Menu from "@/components/Menu";
import styles from "./Plantoes.module.scss";
import InputPesquisa from "@/components/InputPesquisa";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Escala, FarmaciaAberta, FarmaciaPlantao } from "@/types/Farmacia";
import Listagem from "@/components/Listagem";
import Paginacao from "@/components/Paginacao";
import CardFarmacia from "@/components/CardFarmacia";
import FarmaciaFetch from "@/fetch/farmacias";
import { GetManyRequest } from "@/types/Requests";
import Secao from "@/components/Secao";

export default function Plantoes() {
	const fFarmacias = new FarmaciaFetch();

	const [date] = useState(new Date());

	const [pesquisa, setPesquisa] = useState("");
	const [pagina, setPagina] = useState(1);
	const [limite, setLimite] = useState(5);
	const [paginaMax, setPaginaMax] = useState(5);

	const [escala, setEscala] = useState<Escala>({});

	const getFarmacias = () => {
		fFarmacias
			.getFarmaciasPlantoes({ pagina, limite, tempo: date })
			.then((res) => {
				const resposta = res.data as GetManyRequest<Escala>;
				const escala = resposta.dados;

				setEscala(escala);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getFarmacias();
	}, []);

	useEffect(() => {
		console.log(escala);
	}, []);

	return (
		<>
			<Menu />
			<main>
				{Object.keys(escala).length > 0 ? (
					<>
						{Object.keys(escala).map((v: keyof Escala, i) => {
							return (
								<Secao titulo={String(v)} key={i}>
									<div className={styles.farmacias}>
										<Listagem>
											{escala[v].map((f) => {
												return (
													<CardFarmacia
														key={f._id}
														nome={f.nome_fantasia}
														imagem_url={f.imagem_url || ""}
														link_farmacia={`/farmacias/${f._id}`}
													/>
												);
											})}
										</Listagem>
									</div>
								</Secao>
							);
						})}
						<Paginacao
							pagina={pagina}
							setPagina={setPagina}
							paginaMax={paginaMax}
						/>
					</>
				) : (
					<></>
				)}
			</main>
		</>
	);
}
