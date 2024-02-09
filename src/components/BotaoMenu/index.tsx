import { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./BotaoMenu.module.scss";

interface Props extends ComponentPropsWithoutRef<"button"> {
	children?: ReactNode;
}

export default function BotaoMenu({ children, ...props }: Props) {
	return <button className={styles.botao}>{children}</button>;
}
