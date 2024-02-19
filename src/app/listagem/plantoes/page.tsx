import Menu from "@/components/Menu";
import styles from "./Plantoes.module.scss";
import InputPesquisa from "@/components/InputPesquisa";
import { ChangeEvent, FormEvent, useState } from "react";
import { FarmaciaEscala } from "@/types/Farmacia";
import Listagem from "@/components/Listagem";

export default function Plantoes() {
	const [pesquisa, setPesquisa] = useState("");
	const [farmacias, setFarmacias] = useState<FarmaciaEscala[]>([]);

	const inputProps = {
		onChange: (e: ChangeEvent<HTMLInputElement>) => {
			setPesquisa(e.target.value);
		},
		onSubmit: (e: FormEvent<HTMLFormElement> & FormEvent<HTMLInputElement>) => {
			e.preventDefault();
		},
	};

	return (
		<>
			<Menu />
			<main>
				<div>
					<InputPesquisa value={pesquisa} {...inputProps} />
				</div>
				{farmacias.length > 0 ? <Listagem></Listagem> : <></>}
			</main>
		</>
	);
}
