"use client";

import IFarmacia from "@/types/Farmacia";
import FormularioFarmcaia from "../formulario";
import FetchFarmacia from "@/fetch/farmacias";
import { getCookie } from "cookies-next";

export default function CadastroFarmacia() {
	const postFarmacia = new FetchFarmacia().postFarmacia;

	const salvarFarmacia = async (farmacia: IFarmacia) => {
		const token = getCookie("authentication")

		await postFarmacia(farmacia, token)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return <FormularioFarmcaia salvarFarmacia={salvarFarmacia} />;
}
