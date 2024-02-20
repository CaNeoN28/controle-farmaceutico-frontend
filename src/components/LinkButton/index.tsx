import { ReactNode } from "react";
import styles from "./LinkButton.module.scss";
import classNames from "classnames";
import Link from "next/link";

interface Props {
	secundario?: boolean;
	children?: ReactNode;
	link: string;
}

export default function LinkButton({ link, children, secundario }: Props) {
	const classes = classNames({
		[styles.link_button]: true,
		[styles.secundario]: secundario,
		"box-shadow": true,
	});

	return (
		<Link href={link} className={classes}>
			{children}
		</Link>
	);
}
