import { ReactNode } from "react";
import styles from "./InputContainer.module.scss";
import { FieldError } from "react-hook-form";
import classNames from "classnames";

interface Props {
	label: string;
	id: string;
	tamanho?: number | string;
	fullWidth?: boolean;
	error?: FieldError;
	children: ReactNode;
}

export default function InputContainer({
	label,
	id,
	tamanho,
	fullWidth,
	error,
	children,
}: Props) {
	const classes = classNames({
		[styles.container]: true,
		"full-width": fullWidth,
	});
	return (
		<div className={classes} style={tamanho ? { width: tamanho } : {}}>
			{label && (
				<label className={styles.label} htmlFor={id}>
					{label}
				</label>
			)}

			{children}
			{error && <span className={styles.erro}>*{error.message}</span>}
		</div>
	);
}
