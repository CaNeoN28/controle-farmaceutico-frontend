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

	return (
		<button className={classes} onClick={onClick}>
			{data}
		</button>
	);
}
