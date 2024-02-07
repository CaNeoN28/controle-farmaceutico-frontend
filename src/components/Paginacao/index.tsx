import { Dispatch, SetStateAction } from "react";
import styles from "./Paginacao.module.scss";
import Pagina from "../Pagina";

interface Props {
	pagina: number;
	paginaMax: number;
	setPagina: Dispatch<SetStateAction<number>>;
}

export default function Paginacao({ pagina, paginaMax, setPagina }: Props) {
	const getPaginas = () => {
		const paginas = [];
		for (let i = 1; i <= paginaMax; i++) {
			paginas.push(i);
		}

		return paginas;
	};

	return (
		<div>
			{getPaginas().map((p, i) => (
				<Pagina
					key={i}
					onClick={(e) => {
						pagina != p && setPagina(p);
					}}
					ativo={pagina == p}
				>
					{p}
				</Pagina>
			))}
		</div>
	);
}
