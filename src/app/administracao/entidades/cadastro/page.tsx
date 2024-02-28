import styles from "./EntidadesCadastro.module.scss";
import { CadastroMain } from "@/components/Cadastro";
import Menu from "@/components/Menu";

export default function CadastroEntidades() {
	return (
		<>
			<Menu />
			<CadastroMain></CadastroMain>
		</>
	);
}
