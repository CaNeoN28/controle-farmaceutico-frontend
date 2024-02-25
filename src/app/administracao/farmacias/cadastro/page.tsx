"use client";

import styles from "./CadastroFarmacia.module.scss";
import IFarmacia from "@/types/Farmacia";
import FormularioFarmacia from "../formulario";
import FetchFarmacia from "@/fetch/farmacias";
import { getCookie } from "cookies-next";
import Alert from "@/components/Alert";
import { useState } from "react";
import { RequestErro } from "@/types/Requests";
import Botao from "@/components/Botao";

export default function CadastroFarmacia() {
	const [showAlert, setShowAlert] = useState(false);
	const [erro, setErro] = useState<string>();
	const [mensagem, setMensagem] = useState<string>();

	const postFarmacia = new FetchFarmacia().postFarmacia;

	const salvarFarmacia = async (farmacia: IFarmacia) => {
		const token = getCookie("authentication");

		await postFarmacia(farmacia, token)
			.then((res) => {
				console.log(res);
			})
			.catch((err: RequestErro<any>) => {
				const {
					response: { data },
				} = err as RequestErro<string>;

				if (typeof data === "string") {
					setErro(data);
				} else {
					setErro("Não foi possível cadastrar farmácia");
					console.error(err.response);
				}

				setShowAlert(true);
			});
	};

	return (
		<>
			<FormularioFarmacia salvarFarmacia={salvarFarmacia} />
			<Alert show={showAlert} setShow={setShowAlert}>
				<div className={styles.alert}>
					<span className={styles.alert_texto}>{erro || mensagem}</span>
					<div className={styles.alert_opcoes}>
						{erro ? (
							<>
								<Botao fullWidth>Confirmar</Botao>
								<Botao secundario fullWidth>
									Cancelar
								</Botao>
							</>
						) : (
							<>
								<Botao fullWidth>Confirmar</Botao>
							</>
						)}
					</div>
				</div>
			</Alert>
		</>
	);
}
