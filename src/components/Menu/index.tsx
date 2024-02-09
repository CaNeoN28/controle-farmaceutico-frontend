import { useEffect, useState } from "react";
import styles from "./Menu.module.scss";
import BotaoMenu from "../BotaoMenu";

interface Props {}

const getWidth = () => {
	const { innerWidth } = window;

	return innerWidth;
};

export default function Menu({}: Props) {
	const [width, setWidth] = useState(getWidth());

	useEffect(() => {
		window.addEventListener("resize", () => {
			setWidth(getWidth());
		});

		return () => {
			window.removeEventListener("resize", () => {
				setWidth(getWidth());
			});
		};
	}, []);

	if (width >= 480) {
		return <div className={styles.menu}>
			<BotaoMenu>Teste</BotaoMenu>
		</div>;
	}

	return <></>;
}
