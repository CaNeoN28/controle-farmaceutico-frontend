import { useLayoutEffect, useState } from "react";
import { MdMedication, MdOutlineMenu, MdOutlineClose } from "react-icons/md";
import styles from "./Menu.module.scss";
import BotaoMenu from "../BotaoMenu";
import classNames from "classnames";
import { getCookie } from "cookies-next";
import { FaUserCircle } from "react-icons/fa";
import FetchAutenticacao from "@/fetch/autenticacao";
import { IUsuarioAPI } from "@/types/Usuario";

interface Props {}

const getWidth = () => {
	const { innerWidth } = window;

	return innerWidth;
};

export default function Menu({}: Props) {
	const fAuth = new FetchAutenticacao().getPerfil;

	const [userId, setUserId] = useState<string>();
	const [ativo, setAtivo] = useState(false);
	const [width, setWidth] = useState(getWidth());

	const getAuthToken = async () => {
		const token = getCookie("authentication");

		if (token) {
			await fAuth(token)
				.then((res) => {
					const { _id } = res.data as IUsuarioAPI;

					setUserId(_id);
				})
				.catch((_) => {});
		}
	};

	useLayoutEffect(() => {
		getAuthToken();

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
					<BotaoMenu link="/listagem/farmacias">Farmácias</BotaoMenu>
					<BotaoMenu link="/listagem/plantoes">Plantões</BotaoMenu>
					{userId && <BotaoMenu link="/administracao">Administração</BotaoMenu>}
				</div>
				<div className={styles.opcoes}>
					{userId ? (
						<BotaoMenu link="/perfil">
							<span>Perfil</span>
							<FaUserCircle />
						</BotaoMenu>
					) : (
						<>
							<BotaoMenu link="/cadastro">Registrar</BotaoMenu>
							<BotaoMenu link="/login">Entrar</BotaoMenu>
						</>
					)}
				</div>
			</div>
		);
	}

	const classesBackground = classNames({
		[styles.background]: true,
		[styles.ativo]: ativo,
	});

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
				<div
					className={classesBackground}
					onClick={() => {
						setAtivo(false);
					}}
				/>
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
					{userId && <BotaoMenu link="/administracao">Administracao</BotaoMenu>}
					{userId ? (
						<BotaoMenu link="/perfil">Perfil</BotaoMenu>
					) : (
						<BotaoMenu link="/login">Entrar</BotaoMenu>
					)}
				</div>
			</div>
		</div>
	);
}
