"use client";

import Menu from "@/components/Menu";
import styles from "./AutoCadastro.module.scss";
import InputImagem from "@/components/InputImagem";
import { ChangeEvent, useEffect, useState } from "react";

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
					<div>
						{imagemUrl && <img src={imagemUrl} />}
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
