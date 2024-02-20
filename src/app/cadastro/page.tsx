"use client";

import Menu from "@/components/Menu";
import styles from "./AutoCadastro.module.scss";
import InputImagem from "@/components/InputImagem";
import { ChangeEvent, useState } from "react";
import { FaUser } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import { IUsuarioPost } from "@/types/Usuario";
import Botao from "@/components/Botao";

export default function AutoCadastro() {
	const { control, formState, handleSubmit } = useForm<IUsuarioPost>();

	const [imagemUrl, setImagemUrl] = useState<string>();

	const onSubmit: SubmitHandler<IUsuarioPost> = (data) => {
		console.log(data);
	};

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
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.form_inputs}></div>
					<div className={styles.imagem_form}>
						<div className={styles.imagem}>
							{imagemUrl ? (
								<img src={imagemUrl} />
							) : (
								<div className={styles.placeholder}>
									<FaUser />
								</div>
							)}
						</div>
						<InputImagem
							id="foto_perfil_input"
							titulo="Enviar imagem"
							onChange={sendImage}
						/>
					</div>
					<div className={styles.form_buttons}>
						<Botao fullWidth>Enviar</Botao>
						<Botao fullWidth secundario>Cancelar</Botao>
					</div>
				</form>
			</main>
		</>
	);
}
