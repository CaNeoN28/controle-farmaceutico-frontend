"use client";

import Menu from "@/components/Menu";
import styles from "./FarmaciasAdministracao.module.scss";
import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";

interface Params {
	searchParams: {};
}

export default function FarmaciasAdministracao({ searchParams }: Params) {
	redirecionarAutenticacao()

	return (
		<>
			<Menu />
		</>
	);
}
