"use client";

import Menu from "@/components/Menu";
import styles from "./FarmaciasAdministracao.module.scss";
import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";
import TituloSecao from "@/components/TituloSecao";
import Paginacao from "@/components/Paginacao";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

export default function FarmaciasAdministracao() {
	redirecionarAutenticacao();

	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const { pagina} = {
		pagina: Number(searchParams.get("pagina")) || 1,
	};

	const [params, setParams] = useState<URLSearchParams>()

	function addSearchParam(chave: string, valor?: string) {
		const params = new URLSearchParams(searchParams);

		if (valor) {
			params.set(chave, valor);
		} else {
			params.delete(chave);
		}

		setParams(params)
	}

	useLayoutEffect(() => {
		if(params){
			router.replace(`${pathname}?${params}`)
		}
	}, [params])

	return (
		<>
			<Menu />
			<main>
				<TituloSecao>LISTAGEM DE FARMÁCIAS</TituloSecao>
				<div></div>
				<div></div>
				<Paginacao
					pagina={pagina}
					paginaMax={5}
					setPagina={(v) => {
						addSearchParam("pagina", v.toString());
					}}
				/>
			</main>
		</>
	);
}
