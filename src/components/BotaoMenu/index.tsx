import { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./BotaoMenu.module.scss";
import Link from "next/link";

interface Props {
	link: string;
	children?: ReactNode;
}

export default function BotaoMenu({ children, link }: Props) {
	return (
		<Link href={link} className={styles.botao}>
			{children}
		</Link>
	);
}
