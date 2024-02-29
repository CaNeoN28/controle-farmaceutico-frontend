import { ComponentPropsWithoutRef, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import styles from "./Checkbox.module.scss";
import classNames from "classnames";

interface Props extends ComponentPropsWithoutRef<"input"> {
	label: string;
}

export default function Checkbox({ label, ...props }: Props) {
	const { value, onChange } = props;

	const [checked, setChecked] = useState(false);

	const classesContainer = classNames({
		[styles.container]: true,
		[styles.ativo]: checked,
		["box-shadow"]: true,
	});

	return (
		<label className={classesContainer}>
			{label}
			<span className={styles.checkmark}>
				<FaCheck/>
			</span>
			<input
				type="checkbox"
				checked={checked}
				{...props}
				onChange={(e) => {
					setChecked(!checked);
					onChange && onChange(e);
				}}
			/>
		</label>
	);
}
