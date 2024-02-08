import {
	ComponentPropsWithoutRef,
	Dispatch,
	SetStateAction,
	useState,
} from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./Select.module.scss";
import classNames from "classnames";
import { UseFormSetValue } from "react-hook-form";

export interface Opcao {
	valor: string | number;
	label: string;
}

interface Props extends ComponentPropsWithoutRef<"input"> {
	filtro: string;
	setFiltro: Dispatch<SetStateAction<string>>;
	setValue: UseFormSetValue<any>;
	opcoes: Opcao[];
}

export default function Select({
	filtro,
	opcoes,
	name,
	setFiltro,
	setValue,
	...props
}: Props) {
	const [ativo, setAtivo] = useState(false);

	const inputBoxClasses = classNames({
		[styles.input_box]: true,
		[styles.input_ativo]: ativo,
	});

	const opcoesClasses = classNames({
		[styles.opcoes]: true,
		[styles.opcoes_ativo]: ativo,
	});

	!name && console.error("Name é obrigatório");

	return (
		<div className={styles.container}>
			<div className={inputBoxClasses}>
				<input
					className={styles.input}
					type="text"
					value={filtro}
					onChange={(e) => setFiltro(e.target.value)}
				/>
				<span className={styles.icone}>
					{ativo ? <FaChevronUp /> : <FaChevronDown />}
				</span>
			</div>
			{opcoes.length > 0 && (
				<div className={opcoesClasses}>
					{opcoes.map((o, i) => (
						<button
							key={i}
							onClick={(e) => {
								e.preventDefault();
								name && setValue(name, o.valor);
							}}
						>
							{o.label}
						</button>
					))}
				</div>
			)}
			<input className={styles.hidden} {...props} type="text" disabled />
		</div>
	);
}
