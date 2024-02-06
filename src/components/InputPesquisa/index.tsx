import React from "react";
import { FaSearch } from "react-icons/fa";
import styles from "./InputPesquisa.module.scss";

interface Props extends React.ComponentPropsWithoutRef<"input"> {}

export default function InputPesquisa({ ...props }: Props) {
	return (
		<div className={styles.container}>
			<input className={styles.input} type="text" {...props} />
			<button className={styles.icone}>
				<FaSearch />
			</button>
		</div>
	);
}
