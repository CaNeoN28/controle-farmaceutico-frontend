"use client";

import Paginacao from "@/components/Paginacao";
import { useEffect, useState } from "react";

export default function Teste() {
	const [pagina, setPagina] = useState(1);
	const [paginaMax, setPaginaMax] = useState(5);

	useEffect(() => {
		console.log(pagina);
	}, [pagina]);

	return (
		<div>
			<Paginacao pagina={pagina} paginaMax={paginaMax} setPagina={setPagina} botoes={5}/>
		</div>
	);
}
