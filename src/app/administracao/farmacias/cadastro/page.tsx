"use client";

import IFarmacia from "@/types/Farmacia";
import { useState } from "react";
import FormularioFarmcaia from "../formulario";

export default function CadastroFarmacia() {
	const salvarFarmacia = async (farmacia: IFarmacia) => {
		console.log(farmacia);
	};

	return <FormularioFarmcaia salvarFarmacia={salvarFarmacia} />;
}
