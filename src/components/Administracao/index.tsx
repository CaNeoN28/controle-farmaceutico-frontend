import { ReactNode } from "react";
import { MdLocalPharmacy, MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import styles from "./Administracao.module.scss";
import Botao from "../Botao";

interface DefaultProps {
	children?: ReactNode;
}

interface ItemProps extends DefaultProps {
	imagem_url?: string;
	onEdit: () => void;
	onDelete: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function AdministracaoMain({ children }: DefaultProps) {
	return <main className={styles.main_administracao}>{children}</main>;
}

export function AdministracaoContainer({ children }: DefaultProps) {
	return <div className={styles.container_administracao}>{children}</div>;
}

export function AdministracaoFiltros({ children }: DefaultProps) {
	return <div className={styles.filtros_administracao}>{children}</div>;
}

export function AdministracaoListagem({ children }: DefaultProps) {
	return <div className={styles.Administracao_listagem}>{children}</div>;
}

export function AdministracaoItem({ children, imagem_url, onDelete, onEdit }: ItemProps) {
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
				<Botao fullWidth onClick={onEdit}>
					<span>Editar</span>
					<MdEdit />
				</Botao>
				<Botao fullWidth onClick={onDelete}>
					<span>Remover</span>
					<FaTrash/>
				</Botao>
			</div>
		</div>
	);
}
