import Botao from "../Botao";
import styles from "./CenterBox.module.scss";
import { ReactNode } from "react";

interface Props {
	titulo?: string;
	children?: ReactNode;
	cancelText?: string;
	onCancel?: () => void;
	submitText?: string;
	onSubmit?: () => void;
}

export default function CenterBox({
	children,
	titulo,
	onCancel,
	cancelText,
	onSubmit,
	submitText,
}: Props) {
	return (
		<form className={styles.center_box} onSubmit={onSubmit}>
			{titulo && <span className={styles.titulo}>{titulo}</span>}
			<div className={styles.inputs}>{children}</div>
			<div className={styles.botoes}>
				<Botao fullWidth type="submit">
					{submitText}
				</Botao>
				{onCancel && (
					<Botao fullWidth secundario onClick={onCancel}>
						{cancelText}
					</Botao>
				)}
			</div>
		</form>
	);
}
