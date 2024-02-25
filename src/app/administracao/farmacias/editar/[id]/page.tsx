"use client";

import styles from "./EditarFarmacia.module.scss";
import IFarmacia from "@/types/Farmacia";
import FormularioFarmacia from "../../formulario";
import FetchFarmacia from "@/fetch/farmacias";
import { getCookie } from "cookies-next";
import Alert from "@/components/Alert";
import { useEffect, useState } from "react";
import { RequestErro } from "@/types/Requests";
import Botao from "@/components/Botao";
import { useRouter } from "next/navigation";
import Carregando from "@/components/Carregando";
import Menu from "@/components/Menu";
import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";
import { CadastroMain } from "@/components/Cadastro";
import TituloSecao from "@/components/TituloSecao";
import FetchImagem from "@/fetch/imagens";

interface Params {
	id: string;
}

export default function EditarFarmacia({
	params: { id: id_farmacia },
}: {
	params: Params;
}) {
	redirecionarAutenticacao();

	const router = useRouter();
	const fetchFarmacia = new FetchFarmacia();
	const deleteImagem = new FetchImagem().removeImagem;

	const [farmacia, setFarmacia] = useState<IFarmacia>();
	const [showAlert, setShowAlert] = useState(false);
	const [erro, setErro] = useState<string>();
	const [erroEdicao, setErroEdicao] = useState<string>();
	const [mensagem, setMensagem] = useState<string>();

	const getFarmacia = async () => {
		await fetchFarmacia
			.getFarmacia(id_farmacia)
			.then((res) => {
				const farmacia = res.data as IFarmacia;

				console.log(farmacia);

				setFarmacia(farmacia);
			})
			.catch((err) => {
				setErro("Farmácia não encontrada");
			});
	};

	const salvarFarmacia = async (farmacia: IFarmacia) => {
		const token = getCookie("authentication");
		const urlImagem = farmacia.imagem_url;

		await fetchFarmacia
			.updateFarmacia(farmacia, id_farmacia, token)
			.then((res) => {
				setErroEdicao(undefined);
				setMensagem("Farmácia atualizada com sucesso");
				setShowAlert(true);
			})

			.catch((err: RequestErro<any>) => {
				const {
					response: { data },
				} = err;

				if (urlImagem) {
					deleteImagem(urlImagem).then().catch();
				}

				if (typeof data === "string") {
					setErroEdicao(data);
				} else {
					setErroEdicao("Não foi possível atualizar farmácia");
					console.error(err.response);
				}

				setShowAlert(true);
			});
	};

	useEffect(() => {
		getFarmacia();
	}, []);

	return (
		<>
			<Menu />
			{farmacia ? (
				<CadastroMain>
					<TituloSecao>EDIÇÃO DE FARMÁCIA</TituloSecao>
					<FormularioFarmacia
						salvarFarmacia={salvarFarmacia}
						farmacia={farmacia}
					/>
					<Alert
						show={showAlert}
						onClickBackground={() => {
							if (erro) {
								setShowAlert(false);
							} else if (mensagem) {
								setShowAlert(false);
								router.push("/administracao");
							}
						}}
					>
						<div className={styles.alert}>
							<span className={styles.alert_texto}>
								{erroEdicao || mensagem}
							</span>
							<div className={styles.alert_opcoes}>
								{erroEdicao ? (
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
				</CadastroMain>
			) : erro ? (
				<div className={styles.erro}>{erro}</div>
			) : (
				<Carregando />
			)}
		</>
	);
}