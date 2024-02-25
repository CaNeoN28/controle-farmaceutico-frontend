import { Dispatch, ReactNode, SetStateAction } from "react";
import styles from "./Alert.module.scss";

interface Props {
	children?: ReactNode;
	show?: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
}

export default function Alert({ children, show, setShow }: Props) {
	if (show)
		return (
			<div className={styles.background} onClick={() => setShow(false)}>
				<div className={styles.alert}>{children}</div>
			</div>
		);

	return <></>;
}
