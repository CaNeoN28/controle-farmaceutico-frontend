"use client";

import Menu from "@/components/Menu";
import styles from "./EditarEntidade.module.scss";
import FormularioEntidade from "../../formulario";
import { CadastroMain } from "@/components/Cadastro";
import TituloSecao from "@/components/TituloSecao";
import IEntidade from "@/types/Entidades";
import { useEffect, useState } from "react";
import FetchEntidades from "@/fetch/entidades";

interface Params {
	id: string;
}

export default function EditarEntidade({
	params: { id: id_entidade },
}: {
	params: Params;
}) {
	const fEntidades = new FetchEntidades();

	const [entidade, setEntidade] = useState<IEntidade>();

	async function enviarEntidade(data: IEntidade) {}

	async function getEntidade() {
		await fEntidades
			.getEntidade(id_entidade)
			.then((res) => {
				const entidade = res.data;

				setEntidade(entidade);
			})
			.catch(() => {});
	}

	useEffect(() => {
		getEntidade();
	}, []);

	if (entidade)
		return (
			<>
				<Menu />
				<CadastroMain>
					<TituloSecao>EDITAR ENTIDADE</TituloSecao>
					<FormularioEntidade
						entidade={entidade}
						enviarEntidade={enviarEntidade}
					/>
				</CadastroMain>
			</>
		);
}
