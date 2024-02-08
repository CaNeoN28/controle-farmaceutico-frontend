import {
	ComponentPropsWithoutRef,
	Dispatch,
	SetStateAction,
	useLayoutEffect,
	useState,
} from "react";
import { FaChevronDown } from "react-icons/fa";
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
	const [ativo, setAtivo] = useState<boolean>();

	const inputBoxClasses = classNames({
		[styles.input_box]: true,
		[styles.input_ativo]: ativo,
	});

	!name && console.error("Name é obrigatório");

	useLayoutEffect(() => {
		if (ativo !== undefined) {
			const opcoes = document.querySelector(`#opcoes_${name}`);
			const icone = document.querySelector(`#icone_${name}`);

			opcoes!.classList.toggle(styles.aberto);
			icone!.classList.toggle(styles.aberto);
		}
	}, [ativo]);

	return (
		<div className={styles.container}>
			<div className={inputBoxClasses}>
				<input
					className={styles.input}
					type="text"
					value={filtro}
					onChange={(e) => {
						const value = e.target.value;

						if (!ativo) {
							setAtivo(true);
						}

						setFiltro(value);
					}}
				/>
				<span
					id={`icone_${name}`}
					className={styles.icone}
					onClick={() => setAtivo(!ativo)}
				>
					<FaChevronDown />
				</span>
			</div>
			<div id={`opcoes_${name}`} className={styles.opcoes}>
				{opcoes.length > 0 ? (
					opcoes.map((o, i) => (
						<button
							key={i}
							onClick={(e) => {
								e.preventDefault();
								setAtivo(false);
								setFiltro(o.label);
								name && setValue(name, o.valor);
							}}
						>
							{o.label}
						</button>
					))
				) : (
					<span className={styles.erro}>Não encontrado</span>
				)}
			</div>
			<input className={styles.hidden} {...props} type="text" disabled />
		</div>
	);
}
