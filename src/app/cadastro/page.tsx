"use client";

import Menu from "@/components/Menu";
import styles from "./AutoCadastro.module.scss";
import InputImagem from "@/components/InputImagem";
import { ChangeEvent, useState } from "react";
import { FaUser } from "react-icons/fa";

export default function AutoCadastro() {
	const [imagemUrl, setImagemUrl] = useState<string>();

	const sendImage = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;

		if (files && files.length && FileReader) {
			const reader = new FileReader();

			reader.onload = function () {
				setImagemUrl(reader.result as string);
			};

			reader.readAsDataURL(files[0]);
		}
	};

	return (
		<>
			<Menu />
			<main>
				<div>
					<form>{/*Formulário*/}</form>
					<div className={styles.imagem_form}>
						<div className={styles.imagem}>
							{imagemUrl ? (
								<img src={imagemUrl} />
							) : (
								<div className={styles.placeholder} >
									<FaUser/>
								</div>
							)}
						</div>
						<InputImagem
							id="foto_perfil_input"
							titulo="Enviar imagem"
							onChange={sendImage}
						/>
					</div>
				</div>
			</main>
		</>
	);
}
