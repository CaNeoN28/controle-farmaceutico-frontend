"use client";

import styles from "./EmailEnviado.module.scss";
import CenterBox from "@/components/CenterBox";
import Menu from "@/components/Menu";
import { useRouter } from "next/navigation";

export default function EmailEnviado() {
	const router = useRouter();

	return (
		<>
			<title>Email enviado</title>
			<Menu />
			<main className={styles.main}>
				<CenterBox
					titulo="EMAIL ENVIADO"
					submitText="Confirmar"
					onSubmit={(e) => {
						e.preventDefault();
						router.push("/");
					}}
				>
					<span className={styles.mensagem}>
						Por favor verifique na sua caixa de email
					</span>
				</CenterBox>
			</main>
		</>
	);
}
