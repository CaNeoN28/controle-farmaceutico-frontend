import { ComponentPropsWithoutRef, ReactNode, useState } from "react";
import styles from "./Select.module.scss";

interface Props extends ComponentPropsWithoutRef<"input"> {
	children?: ReactNode;
}

export default function Select({ children, ...props }: Props) {
	const [ativo, setAtivo] = useState(false);

	return (
		<div>
			<input {...props} type="text" disabled/>
		</div>
	);
}
