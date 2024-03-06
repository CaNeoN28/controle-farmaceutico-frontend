import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import styles from "./Checkbox.module.scss";
import classNames from "classnames";

interface Props extends ComponentPropsWithoutRef<"input"> {
	ativo: string;
	inativo: string;
}

export default function Checkbox({ inativo, ativo, ...props }: Props) {
	const { value, onChange } = props;

	const [checked, setChecked] = useState<boolean>(false);

	const classesContainer = classNames({
		[styles.container]: true,
		[styles.ativo]: checked,
		["box-shadow"]: true,
	});

	useEffect(() => {
		if (value == "false") {
			setChecked(false);
		} else {
			setChecked(true);
		}
	}, []);

	return (
		<label className={classesContainer}>
			{checked ? ativo : inativo}
			<span className={styles.checkmark}>
				<FaCheck />
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
