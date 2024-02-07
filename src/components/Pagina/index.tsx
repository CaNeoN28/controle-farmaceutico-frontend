import styles from "./Pagina.module.scss";
import classNames from "classnames";
import { ComponentPropsWithoutRef, MouseEventHandler, ReactNode } from "react";

interface Props {
	ativo?: boolean;
	children?: ReactNode;
}

export default function Pagina({
	children,
	ativo,
	onClick,
	...props
}: Props & ComponentPropsWithoutRef<"button">) {
	const classes = classNames({
		[styles.pagina]: true,
		[styles.ativo]: ativo,
	});

	return (
		<button
			className={classes}
			onClick={(e) => {
				e.preventDefault();
				onClick && onClick(e);
			}}
			{...props}
		>
			{children}
		</button>
	);
}
