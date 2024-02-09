import { useLayoutEffect, useState } from "react";
import { MdMedication, MdOutlineMenu, MdOutlineClose } from "react-icons/md";
import styles from "./Menu.module.scss";
import BotaoMenu from "../BotaoMenu";
import classNames from "classnames";

interface Props {}

const getWidth = () => {
	const { innerWidth } = window;

	return innerWidth;
};

export default function Menu({}: Props) {
	const [ativo, setAtivo] = useState(false);
	const [width, setWidth] = useState(getWidth());

	useLayoutEffect(() => {
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
					<BotaoMenu link="/">
						<span>PLATAFORMA</span> <MdMedication />
					</BotaoMenu>
					<BotaoMenu link="/listagem/farmacia">Farmácias</BotaoMenu>
					<BotaoMenu link="/listagem/plantoes">Plantões</BotaoMenu>
					<BotaoMenu link="/administracao">Administração</BotaoMenu>
				</div>
				<div>
					<BotaoMenu link="/login">Entrar</BotaoMenu>
				</div>
			</div>
		);
	}

	const classesBackground = classNames({
		[styles.background]: true,
		[styles.ativo]: ativo
	})

	const classesContent = classNames({
		[styles.content]: true,
		[styles.ativo]: ativo,
	});

	const classesBotao = classNames({
		[styles.icone]: true,
		[styles.botao]: true,
	});

	return (
		<div className={styles.hamburguer}>
			<MdMedication className={styles.icone} />
			<div>
				<MdOutlineMenu
					className={classesBotao}
					onClick={() => {
						setAtivo(true);
					}}
				/>
				<div className={classesBackground} onClick={() => {setAtivo(false)}}/>
				<div className={classesContent}>
						<span className={styles.fechar}>
							<MdOutlineClose
								className={classesBotao}
								onClick={() => {
									setAtivo(false);
								}}
							/>
						</span>
						<BotaoMenu link="/">Início</BotaoMenu>
						<BotaoMenu link="/listagem/farmacias">Listagem de farmácia</BotaoMenu>
						<BotaoMenu link="/listagem/plantoes">Listagem de plantões</BotaoMenu>
						<BotaoMenu link="/administracao">Administracao</BotaoMenu>
						<BotaoMenu link="/login">Entrar</BotaoMenu>
					</div>
			</div>
		</div>
	);
}
