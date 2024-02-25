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
import { useRouter } from "next/navigation";
import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";
import Menu from "@/components/Menu";

export default function CadastroFarmacia() {
	redirecionarAutenticacao();

	const router = useRouter();
	const postFarmacia = new FetchFarmacia().postFarmacia;

	const [showAlert, setShowAlert] = useState(false);
	const [erro, setErro] = useState<string>();
	const [mensagem, setMensagem] = useState<string>();

	const salvarFarmacia = async (farmacia: IFarmacia) => {
		const token = getCookie("authentication");

		await postFarmacia(farmacia)
			.then((res) => {
				setErro(undefined);
				setMensagem("Farmácia cadastrada com sucesso");
				setShowAlert(true);
			})

			.catch((err: RequestErro<any>) => {
				const {
					response: { data },
				} = err;

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
			<Menu />
			<FormularioFarmacia salvarFarmacia={salvarFarmacia} />
			<Alert show={showAlert} setShow={setShowAlert}>
				<div className={styles.alert}>
					<span className={styles.alert_texto}>{erro || mensagem}</span>
					<div className={styles.alert_opcoes}>
						{erro ? (
							<>
								<Botao
									fullWidth
									onClick={() => {
										setShowAlert(false);
									}}
								>
									Continuar
								</Botao>
								<Botao
									secundario
									fullWidth
									onClick={() => {
										router.push("/administracao");
									}}
								>
									Cancelar
								</Botao>
							</>
						) : (
							<>
								<Botao
									fullWidth
									onClick={() => {
										router.push("/administracao/farmacias");
									}}
								>
									Confirmar
								</Botao>
							</>
						)}
					</div>
				</div>
			</Alert>
		</>
	);
}
