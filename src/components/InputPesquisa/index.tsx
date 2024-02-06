import React from "react";
import { FaSearch } from "react-icons/fa";
import styles from "./InputPesquisa.module.scss";

interface Props {
	onSubmit: React.FormEventHandler<HTMLFormElement>;
}

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}

export default function InputPesquisa({
	onSubmit,
	...props
}: Props & InputProps) {
	return (
		<form className={styles.container} onSubmit={onSubmit}>
			<input className={styles.input} type="text" {...props} />
			<button className={styles.icone} type="submit">
				<FaSearch />
			</button>
		</form>
	);
}
