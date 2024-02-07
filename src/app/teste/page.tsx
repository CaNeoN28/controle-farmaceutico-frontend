"use client";

import HorarioServico from "@/components/HorarioServico";

export default function Teste() {
	return (
		<div>
			<HorarioServico
				dia_semana="Segunda feira"
				entrada="entrada"
				saida="saida"
				onClick={(e) => {
					console.log("teste");
				}}
			/>
		</div>
	);
}
