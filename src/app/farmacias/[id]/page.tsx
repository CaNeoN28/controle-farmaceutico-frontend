"use client";

import Menu from "@/components/Menu";
import FarmaciaFetch from "@/fetch/farmacias";
import Farmacia from "@/types/Farmacia";
import { useEffect, useState } from "react";

interface Params {
	id: string;
}

export default function Farmacia({ params }: { params: Params }) {
	const { id: farmaciaId } = params;

	const fFarmacias = new FarmaciaFetch();

	const [farmacia, setFarmacia] = useState<Farmacia>();
	const [erroFarmacia, setErroFarmacia] = useState("");

	const getFarmacia = () => {
		fFarmacias
			.getFarmacia(farmaciaId)
			.then((res) => {
				const resposta = res.data as Farmacia;

				setFarmacia(resposta);
			})
			.catch((err) => {
				setErroFarmacia(`Não foi possível encontrar farmácia: ${err.data}`);
			});
	};

	useEffect(() => {
		getFarmacia();
	}, []);

	return (
		<>
			<Menu />
			{farmacia ? (
				<main>{farmacia.nome_fantasia}</main>
			) : (
				<span>{erroFarmacia}</span>
			)}
		</>
	);
}
