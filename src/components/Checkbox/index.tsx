import { ComponentPropsWithoutRef } from "react";
import styles from "./Checkbox.module.scss";

interface Props extends ComponentPropsWithoutRef<"input"> {
	label: string;
}

export default function Checkbox({ label, ...props }: Props) {
	const { value } = props;

	return (
		<label className={styles.container}>
			{label}
			<input type="checkbox" checked={!!value} {...{ ...props }} />
			<span className={styles.checkmark}></span>
		</label>
	);
}
