import { FormEventHandler, ReactNode, useEffect, useState } from "react";
import { MdLocalPharmacy, MdEdit } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import styles from "./Administracao.module.scss";
import Botao from "../Botao";
import LinkButton from "../LinkButton";
import classNames from "classnames";

interface DefaultProps {
	children?: ReactNode;
}

interface FiltrosProps extends DefaultProps {
	onSubmit: FormEventHandler<HTMLFormElement>;
}

interface ConfirmarFiltrosProps extends DefaultProps {
	onClean: () => void;
}

interface ItemProps extends DefaultProps {
	id?: string;
	imagem_url?: string;
	linkEditar?: string;
	conteudoPrincipal?: ReactNode;
	conteudoSecundario?: ReactNode;
	onDelete: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function AdministracaoMain({ children }: DefaultProps) {
	return <main className={styles.main_administracao}>{children}</main>;
}

export function AdministracaoContainer({ children }: DefaultProps) {
	return <div className={styles.container_administracao}>{children}</div>;
}

export function AdministracaoFiltros({ children, onSubmit }: FiltrosProps) {
	return (
		<form className={styles.filtros_administracao} onSubmit={onSubmit}>
			{children}
		</form>
	);
}

export function AdministracaoConfirmarFiltros({
	onClean,
}: ConfirmarFiltrosProps) {
	return (
		<div className={styles.confirmar_filtros_administracao}>
			<Botao fullWidth type="submit">
				Aplicar
			</Botao>
			<Botao fullWidth secundario onClick={onClean}>
				Limpar
			</Botao>
		</div>
	);
}

export function AdministracaoListagem({ children }: DefaultProps) {
	return <div className={styles.listagem_administracao}>{children}</div>;
}

export function AdministracaoItem({
	id,
	children,
	imagem_url,
	linkEditar,
	conteudoPrincipal,
	conteudoSecundario,
	onDelete,
}: ItemProps) {
	const [width, setWidth] = useState(window.innerWidth);
	const [ativo, setAtivo] = useState(false);

	useEffect(() => {
		const dropbutton = document.querySelector(`#dropbutton_${id}`);
		const content = document.querySelector(`#content_${id}`);

		if (dropbutton && content) {
			dropbutton.classList.toggle(styles.ativo);
			content.classList.toggle(styles.ativo);
		}
	}, [ativo]);

	useEffect(() => {
		const getWidth = () => {
			const { innerWidth } = window;

			setWidth(innerWidth);
		};

		setAtivo(false);

		window.addEventListener("resize", getWidth);

		return () => {
			window.removeEventListener("resize", getWidth);
		};
	}, []);

	if (width >= 780)
		return (
			<div id={`item_${id}`} className={styles.item_administracao}>
				<div className={styles.item_imagem}>
					{imagem_url ? (
						<img src={`${API_URL}${imagem_url}`} />
					) : (
						<div className={styles.placeholder}>
							<MdLocalPharmacy />
						</div>
					)}
				</div>
				<div className={styles.content}>
					<div className={styles.main_content}>{conteudoPrincipal}</div>
					<div className={styles.secondary_content}>{conteudoSecundario}</div>
				</div>
				<div className={styles.acoes}>
					<LinkButton secundario especial link={linkEditar || ""}>
						<span>Editar</span>
						<MdEdit />
					</LinkButton>
					<Botao vermelho secundario especial fullWidth onClick={onDelete}>
						<span>Remover</span>
						<FaTrash />
					</Botao>
				</div>
			</div>
		);

	return (
		<div className={styles.item_administracao}>
			<div
				className={styles.main_info}
				onClick={() => {
					setAtivo(!ativo);
				}}
			>
				<div className={styles.item_imagem}>
					{imagem_url ? (
						<img src={`${API_URL}${imagem_url}`} />
					) : (
						<div className={styles.placeholder}>
							<MdLocalPharmacy />
						</div>
					)}
				</div>
				<div className={styles.main_content}>{conteudoPrincipal}</div>
				<div id={`dropbutton_${id}`} className={styles.dropbutton}>
					<FaChevronDown />
				</div>
			</div>
			<div id={`content_${id}`} className={styles.hidden_content}>
				<div className={styles.secondary_content}>{conteudoSecundario}</div>
				<div className={styles.acoes}>
					<LinkButton secundario especial link={linkEditar || ""}>
						<span>Editar</span>
						<MdEdit />
					</LinkButton>
					<Botao vermelho secundario especial fullWidth onClick={onDelete}>
						<span>Remover</span>
						<FaTrash />
					</Botao>
				</div>
			</div>
		</div>
	);
}
