"use client";

import Botao from "@/components/Botao";
import Select, { Opcao } from "@/components/Select";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Teste() {
	const opcoes: Opcao[] = [
		{
			label: "1",
			valor: "1",
		},
		{
			label: "2",
			valor: "2",
		},
		{
			label: "3",
			valor: "3",
		},
		{
			label: "4",
			valor: "4",
		},
		{
			label: "5",
			valor: "5",
		},
		{
			label: "6",
			valor: "6",
		},
	];

	const [filtro, setFiltro] = useState("");
	const [opcoesFiltradas, setOpcoes] = useState(opcoes);

	const { handleSubmit, control, setValue } = useForm({ defaultValues: { select: 3 } });

	const onSubmit = (data: any) => {
		console.log(data);
	};

	useEffect(() => {
		const filtrados = opcoes.filter((o) => {
			const regex = new RegExp(filtro, "i");

			return regex.test(o.label);
		});

		setOpcoes(filtrados);
	}, [filtro]);

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Controller
					name="select"
					control={control}
					render={({ field }) => (
						<Select
							{...{ ...field, ref: null }}
							filtro={filtro}
							opcoes={opcoes}
							setFiltro={setFiltro}
							setValue={setValue}
						/>
					)}
				/>
				<Botao type="submit">Enviar</Botao>
			</form>
		</div>
	);
}
