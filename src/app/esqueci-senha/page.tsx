"use client";

import Menu from "@/components/Menu";
import styles from "./EsqueciSenha.module.scss";
import CenterBox from "@/components/CenterBox";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";

export default function EsqueciSenha() {
	return (
		<>
			<Menu />
			<CenterBox
				titulo="ESQUECEU A SENHA"
				cancelText="Cancelar"
				onCancel={() => {}}
				submitText="Enviar email"
				onSubmit={() => {}}
			>
				<InputContainer id="email" label="Email">
					<Input id="email" />
				</InputContainer>
			</CenterBox>
		</>
	);
}
