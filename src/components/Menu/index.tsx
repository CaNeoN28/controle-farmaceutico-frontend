import { useEffect, useState } from "react";
import { MdMedication } from "react-icons/md";
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

	if (width >= 672) {
		return (
			<div className={styles.menu}>
				<div className={styles.opcoes}>
					<BotaoMenu>
						<span>PLATAFORMA</span> <MdMedication/>
					</BotaoMenu>
					<BotaoMenu>Farmácias</BotaoMenu>
					<BotaoMenu>Plantões</BotaoMenu>
					<BotaoMenu>Administração</BotaoMenu>
				</div>
				<div>
					<BotaoMenu>Entrar</BotaoMenu>
				</div>
			</div>
		);
	}

	return <></>;
}
