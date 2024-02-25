"use client";

import IFarmacia from "@/types/Farmacia";
import FormularioFarmacia from "../formulario";
import FetchFarmacia from "@/fetch/farmacias";
import { getCookie } from "cookies-next";
import Alert from "@/components/Alert";
import { useState } from "react";

export default function CadastroFarmacia() {
	const [showAlert, setShowAlert] = useState(true);

	const postFarmacia = new FetchFarmacia().postFarmacia;

	const salvarFarmacia = async (farmacia: IFarmacia) => {
		const token = getCookie("authentication");

		await postFarmacia(farmacia, token)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<>
			<FormularioFarmacia salvarFarmacia={salvarFarmacia} />
			<Alert show={showAlert} setShow={setShowAlert}>
				Teste
			</Alert>
		</>
	);
}
