"use client";

import styles from "./EmailEnviado.module.scss";
import CenterBox from "@/components/CenterBox";
import Menu from "@/components/Menu";
import { useRouter } from "next/navigation";

export default function EmailEnviado() {
	const router = useRouter();

	return (
		<>
			<Menu />
			<main className={styles.main}>
				<CenterBox
					titulo="EMAIL ENVIADO"
					submitText="Confirmar"
					onSubmit={() => {
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
