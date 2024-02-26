import {
	ComponentPropsWithoutRef,
	Dispatch,
	SetStateAction,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import { FaChevronDown } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import styles from "./Select.module.scss";
import classNames from "classnames";
import { UseFormSetValue } from "react-hook-form";

export interface Opcao {
	valor: string | number;
	label: string;
}

interface Props extends ComponentPropsWithoutRef<"input"> {
	filtro: string;
	placeholder: string;
	opcoes: Opcao[];
	setFiltro: Dispatch<SetStateAction<string>>;
	setValue?: UseFormSetValue<any>;
	setValueState?: Dispatch<SetStateAction<string>>;
}

export default function Select({
	filtro,
	opcoes,
	name,
	placeholder,
	disabled,
	setFiltro,
	setValue,
	setValueState,
	...props
}: Props) {
	const [ativo, setAtivo] = useState<boolean>();
	const { value } = props;

	const inputBoxClasses = classNames({
		[styles.input_box]: true,
		[styles.input_ativo]: ativo,
		[styles.input_disabled]: disabled,
	});

	!name && console.error("Name é obrigatório");

	const nome_formatado = name?.replaceAll(".", "_");

	useLayoutEffect(() => {
		if (ativo !== undefined) {
			const opcoes = document.querySelector(`#opcoes_${nome_formatado}`);
			const icone = document.querySelector(`#icone_${nome_formatado}`);

			if (opcoes) opcoes.classList.toggle(styles.aberto);

			if (icone) icone.classList.toggle(styles.aberto);
		}
	}, [ativo]);

	useEffect(() => {
		if (disabled && ativo) {
			setAtivo(false);
		}
	}, [disabled]);

	return (
		<div className={styles.container}>
			<div className={inputBoxClasses}>
				<input
					className={styles.input}
					type="text"
					value={filtro}
					placeholder={placeholder}
					disabled={disabled}
					onChange={(e) => {
						const value = e.target.value;

						if (!ativo) {
							setAtivo(true);
						}

						setFiltro(value);
					}}
				/>
				<div className={styles.icones}>
					{!disabled && value && (
						<span
							className={styles.icone_remover}
							onClick={() => {
								setFiltro("");
								if (name) {
									if (setValue) {
										setValue(name, "");
									} else if (setValueState) {
										setValueState("");
									}
								}
							}}
						>
							<MdOutlineClose />
						</span>
					)}
					<span
						id={`icone_${nome_formatado}`}
						className={styles.icone_abrir}
						onClick={() => !disabled && setAtivo(!ativo)}
					>
						<FaChevronDown />
					</span>
				</div>
			</div>
			<div id={`opcoes_${nome_formatado}`} className={styles.opcoes}>
				{opcoes.length > 0 ? (
					opcoes.map((o, i) => (
						<button
							disabled={!ativo}
							key={i}
							onClick={(e) => {
								e.preventDefault();
								setAtivo(false);
								setFiltro(o.label);
								if (name) {
									if (setValue) {
										setValue(name, o.valor);
									} else if (setValueState) {
										setValueState(String(o.valor));
									}
								}
							}}
						>
							{o.label}
						</button>
					))
				) : (
					<span className={styles.erro}>Não encontrado</span>
				)}
			</div>
			<input
				className={styles.hidden}
				value={value}
				{...props}
				type="text"
				disabled
			/>
		</div>
	);
}
