"use client";

import Menu from "@/components/Menu";
import styles from "./Administracao.module.scss";
import OpcaoAdministrativa from "@/components/OpcaoAdministrativa";
import classNames from "classnames";

export default function Administracao() {
	const classesMain = classNames({
		[styles.main]: true,
		["box-shadow"]: true,
	});

	return (
		<>
			<Menu />
			<main className={classesMain}>
				<div className={styles.opcoes}>
					<div className={styles.conjunto}>
						<OpcaoAdministrativa
							tipo="farmacia"
							url_destino="/administracao/farmacias"
						>
							Listagem de Farmácias
						</OpcaoAdministrativa>
						<OpcaoAdministrativa
							tipo="farmacia"
							url_destino="/administracao/farmacias/cadastro"
						>
							Cadastro de Farmácia
						</OpcaoAdministrativa>
					</div>
					<div className={styles.conjunto}>
						<OpcaoAdministrativa
							tipo="usuario"
							url_destino="/administracao/usuarios"
						>
							Listagem de Usuários
						</OpcaoAdministrativa>
						<OpcaoAdministrativa
							tipo="usuario"
							url_destino="/administracao/usuarios/cadastro"
						>
							Cadastro de Usuários
						</OpcaoAdministrativa>
					</div>
					<div className={styles.conjunto}>
						<OpcaoAdministrativa
							tipo="entidade"
							url_destino="/administracao/entidades"
						>
							Listagem de Entidades
						</OpcaoAdministrativa>
						<OpcaoAdministrativa
							tipo="entidade"
							url_destino="/administracao/entidades/cadastro"
						>
							Cadastro de Entidades
						</OpcaoAdministrativa>
					</div>
				</div>
			</main>
		</>
	);
}
