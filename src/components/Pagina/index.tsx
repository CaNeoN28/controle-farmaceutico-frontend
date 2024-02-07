import styles from "./Pagina.module.scss";
import classNames from "classnames";
import { ComponentPropsWithoutRef, MouseEventHandler, ReactNode } from "react";

interface Props {
	ativo?: boolean;
	clicavel?: boolean;
	children?: ReactNode;
}

export default function Pagina({
	children,
	ativo,
	clicavel,
	onClick,
	...props
}: Props & ComponentPropsWithoutRef<"button">) {
	const classes = classNames({
		[styles.pagina]: true,
		[styles.ativo]: ativo,
		[styles.clicavel]: clicavel,
		[styles.inativo]: !ativo && !clicavel,
	});

	return (
		<button
			className={classes}
			onClick={(e) => {
				e.preventDefault();
				clicavel && onClick && onClick(e);
			}}
			{...props}
		>
			{children}
		</button>
	);
}
