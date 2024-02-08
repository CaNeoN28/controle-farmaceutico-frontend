import {
	ComponentPropsWithoutRef,
	Dispatch,
	SetStateAction,
	useState,
} from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./Select.module.scss";

export interface Opcao<T> {
	valor: T;
	label: string;
}

interface Props<T> extends ComponentPropsWithoutRef<"input"> {
	filtro: string;
	setFiltro: Dispatch<SetStateAction<string>>;
	opcoes: Opcao<T>[];
}

export default function Select<T>({
	filtro,
	setFiltro,
	opcoes,
	onChange,
	...props
}: Props<T>) {
	const [ativo, setAtivo] = useState(false);

	return (
		<div className={styles.container}>
			<input
				className={styles.input}
				type="text"
				value={filtro}
				onChange={(e) => setFiltro(e.target.value)}
			/>
			<span className={styles.icone}>
				{ativo ? <FaChevronUp /> : <FaChevronDown />}
			</span>
			<input
				className={styles.hidden}
				onChange={onChange}
				{...props}
				type="text"
				disabled
			/>
		</div>
	);
}
