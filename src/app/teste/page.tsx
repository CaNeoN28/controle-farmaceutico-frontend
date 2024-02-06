"use client";

import InputPesquisa from "@/components/InputPesquisa";
import { useState } from "react";

export default function Teste() {
	const [texto, setTexto] = useState("");

	return (
		<div>
			<InputPesquisa
				onSubmit={(e) => {
					e.preventDefault();
					console.log(texto);
				}}
				value={texto}
				onChange={(e) => {
					setTexto(e.target.value);
				}}
			/>
		</div>
	);
}
