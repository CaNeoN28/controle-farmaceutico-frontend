import classNames from "classnames";
import styles from "./DiaPlantao.module.scss";
import { MouseEventHandler } from "react";

interface Props {
	data: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function DiaPlantao({ data, onClick }: Props) {
	const classes = classNames({
		[styles.diaplantao]: true,
	});

	const date = new Date(data);

	if (isNaN(Number(date))) {
		return <></>;
	}

	const { dia, mes, ano } = {
		dia: date.getDate(),
		mes: date.getMonth() + 1,
		ano: date.getFullYear(),
	};

	return (
		<button className={classes} onClick={onClick}>
			<span>{dia}/{mes}</span>
			<span className={styles.ano}>{ano}</span>
		</button>
	);
}
