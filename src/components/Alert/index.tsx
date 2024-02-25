import { Dispatch, ReactNode, SetStateAction } from "react";
import styles from "./Alert.module.scss";

interface Props {
	children?: ReactNode;
	show?: boolean;
	onClickBackground?: () => void;
}

export default function Alert({ children, show, onClickBackground }: Props) {
	if (show)
		return (
			<div className={styles.background} onClick={onClickBackground}>
				<div className={styles.alert}>{children}</div>
			</div>
		);

	return <></>;
}
