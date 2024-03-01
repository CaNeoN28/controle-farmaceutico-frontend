"use client";

import Menu from "@/components/Menu";
import styles from "./EsqueciSenha.module.scss";
import CenterBox from "@/components/CenterBox";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import regexValidation from "@/utils/regexValidation";
import FetchAutenticacao from "@/fetch/autenticacao";
import { useEffect, useState } from "react";

export default function EsqueciSenha() {
	const router = useRouter();

	const esqueciSenha = new FetchAutenticacao().esqueciSenha;

	const {
		control,
		formState: { errors },
		handleSubmit,
	} = useForm<{ email: string }>({
		defaultValues: {
			email: "",
		},
	});

	const [erro, setErro] = useState("");

	const onCancel = () => {
		router.back();
	};

	const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
		await esqueciSenha(data.email)
			.then((res) => {
				router.push("/email-enviado")
			})
			.catch((err) => {
				const erro = err.response.data as string;

				setErro(erro);
			});
	};

	useEffect(() => {
		if (erro) {
			setTimeout(() => {
				setErro("");
			}, 5000);
		}
	}, [erro]);

	return (
		<>
			<Menu />
			<main className={styles.main}>
				<CenterBox
					titulo="ESQUECEU A SENHA"
					cancelText="Cancelar"
					onCancel={onCancel}
					submitText="Enviar email"
					onSubmit={handleSubmit(onSubmit)}
				>
					<Controller
						control={control}
						name="email"
						rules={{
							required: {
								message: "Email é obrigatório",
								value: true,
							},
							pattern: {
								message: "Email inválido",
								value: regexValidation.EMAIL,
							},
						}}
						render={({ field }) => {
							return (
								<InputContainer id="email" label="Email" error={errors.email}>
									<Input id="email" {...{ ...field, ref: null }} />
								</InputContainer>
							);
						}}
					/>
					{erro && <span className={styles.erro}>{erro}</span>}
				</CenterBox>
			</main>
		</>
	);
}
