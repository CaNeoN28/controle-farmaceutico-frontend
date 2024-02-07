import { Dispatch, SetStateAction } from "react";
import {
	MdOutlineKeyboardArrowLeft,
	MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import styles from "./Paginacao.module.scss";
import Pagina from "../Pagina";

interface Props {
	pagina: number;
	paginaMax: number;
	botoes: number;
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

	const diminuirPagina = () => {
		setPagina(pagina - 1);
	};

	const aumentarPagina = () => {
		setPagina(pagina + 1);
	};

	return (
		<div className={styles.paginacao}>
			<Pagina
				onClick={(e) => {
					diminuirPagina();
				}}
				clicavel={pagina !== 1}
			>
				<MdOutlineKeyboardArrowLeft />
			</Pagina>
			{getPaginas().map((p, i) => (
				<Pagina
					key={i}
					onClick={(e) => {
						pagina != p && setPagina(p);
					}}
					clicavel={pagina != p}
					ativo={pagina == p}
				>
					{p}
				</Pagina>
			))}
			<Pagina
				onClick={(e) => {
					aumentarPagina();
				}}
				clicavel={pagina != paginaMax}
			>
				<MdOutlineKeyboardArrowRight />
			</Pagina>
		</div>
	);
}
