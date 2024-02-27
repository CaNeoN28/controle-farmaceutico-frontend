import { FormEventHandler, ReactNode } from "react";
import { MdLocalPharmacy, MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import styles from "./Administracao.module.scss";
import Botao from "../Botao";
import LinkButton from "../LinkButton";

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
	imagem_url?: string;
	linkEditar?: string;
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
	children,
	imagem_url,
	linkEditar,
	onDelete,
}: ItemProps) {
	return (
		<div className={styles.item_administracao}>
			<div className={styles.item_imagem}>
				{imagem_url ? (
					<img src={`${API_URL}${imagem_url}`} />
				) : (
					<div className={styles.placeholder}>
						<MdLocalPharmacy />
					</div>
				)}
			</div>
			<div className={styles.content}>{children}</div>
			<div className={styles.acoes}>
				<LinkButton link={linkEditar || ""}>
					<span>Editar</span>
					<MdEdit />
				</LinkButton>
				<Botao fullWidth onClick={onDelete}>
					<span>Remover</span>
					<FaTrash />
				</Botao>
			</div>
		</div>
	);
}
