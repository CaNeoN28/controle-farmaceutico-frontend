import { ReactNode } from "react";
import styles from "./LinkButton.module.scss";
import classNames from "classnames";
import Link from "next/link";

interface Props {
	secundario?: boolean;
	vermelho?: boolean;
	especial?: boolean;
	children?: ReactNode;
	link: string;
}

export default function LinkButton({
	link,
	children,
	secundario,
	especial,
	vermelho,
}: Props) {
	const classes = classNames({
		[styles.link_button]: true,
		[styles.secundario]: secundario,
		[styles.vermelho]: vermelho,
		[styles.especial]: especial,
		"box-shadow": true,
	});

	return (
		<Link href={link} className={classes}>
			{children}
		</Link>
	);
}
