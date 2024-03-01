"use client";

import Menu from "@/components/Menu";
import styles from "./Perfil.module.scss";
import { CadastroContainer, CadastroForm } from "@/components/Cadastro";
import { useEffect, useState } from "react";
import IUsuarioGet, {
	IUsuarioAPI,
	IUsuarioCadastro,
	IUsuarioPost,
} from "@/types/Usuario";
import FetchAutenticacao from "@/fetch/autenticacao";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";

export default function Perfil() {
	const router = useRouter();

	const fAuth = new FetchAutenticacao();

	const {
		control,
		formState: { errors },
		watch,
		setValue,
		handleSubmit,
	} = useForm<IUsuarioCadastro>({
		defaultValues: {
			nome_completo: "",
			cpf: "",
			numero_registro: "",
			nome_usuario: "",
			email: "",
			senha: "",
			confirmacao_senha: "",
		},
	});

	const [usuario, setUsuario] = useState<IUsuarioGet>();
	const [token, setToken] = useState<string>();

	async function getUsuario() {
		const token = getCookie("authentication");

		await fAuth
			.getPerfil(token)
			.then((res) => {
				const usuario = res.data as IUsuarioGet;
				console.log(usuario);

				setUsuario(usuario);
				setToken(token);
			})
			.catch(() => {
				deleteCookie("authentication");
				router.push("/login");
			});
	}

	const onUpdate: SubmitHandler<IUsuarioCadastro> = async function (data) {
		console.log(data);
	};

	useEffect(() => {
		getUsuario();
	}, []);

	useEffect(() => {
		if (usuario) {
			setValue("nome_completo", usuario.nome_completo);
			setValue("cpf", usuario.cpf);
			setValue("numero_registro", usuario.numero_registro);
			setValue("nome_usuario", usuario.nome_usuario);
			setValue("email", usuario.email);
		}
	}, [usuario]);

	if (usuario)
		return (
			<>
				<Menu />
				<main className={styles.main}>
					<CadastroContainer>
						<Controller
							control={control}
							name="nome_completo"
							disabled
							render={({ field }) => {
								return (
									<InputContainer
										id="nome_completo"
										label="Nome completo"
									>
										<Input id="nome_completo" {...{ ...field, ref: null }} />
									</InputContainer>
								);
							}}
						/>
					</CadastroContainer>
				</main>
			</>
		);

	return <></>;
}
