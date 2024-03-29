import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./Plantoes.module.scss";
import DiaPlantao from "@/components/DiaPlantao";
import Input from "@/components/Input";
import InputContainer from "@/components/InputContainer";
import { FaPlus } from "react-icons/fa";
import Botao from "@/components/Botao";
import { FieldError } from "react-hook-form";
import classNames from "classnames";
import { CadastroForm } from "@/components/Cadastro";

interface Erros {
	entrada?: FieldError;
	saida?: FieldError;
}
interface Plantao {
	entrada: string;
	saida: string;
}

interface Props {
	plantoes: Plantao[];
	setPlantoes: Dispatch<SetStateAction<Plantao[]>>;
}

export default function Plantoes({ plantoes, setPlantoes }: Props) {
	const [entrada, setEntrada] = useState("");
	const [saida, setSaida] = useState("");

	const [erros, setErros] = useState<Erros>({});

	const onSubmit = () => {
		const erros: any = {};

		if (!entrada) {
			erros.entrada = { message: "A data de entrada é obrigatória" };
		}

		if (!saida) {
			erros.saida = { message: "A data de saída é obrigatória" };
		}

		if (Object.keys(erros).length > 0) {
			setErros(erros);

			return;
		}

		setErros({});
		setEntrada("");
		setSaida("");

		setPlantoes([
			...plantoes,
			{
				entrada,
				saida,
			},
		]);
	};

	const classesForm = classNames({
		[styles.form]: true,
		[styles.erros]: Object.keys(erros).length > 0,
	});

	useEffect(() => {
		if (entrada) {
			const errosNovos = { ...erros };
			delete errosNovos.entrada;

			setErros(errosNovos);
		}

		if (saida && entrada) {
			const dataEntrada = new Date(entrada);
			const dataSaida = new Date(saida);

			if (Number(dataEntrada) > Number(dataSaida)) {
				setSaida(entrada);
			}
		} else {
			setSaida(entrada);
		}
	}, [entrada]);

	useEffect(() => {
		if (saida) {
			const errosNovos = { ...erros };
			delete errosNovos.saida;

			setErros(errosNovos);
		}

		if (saida && entrada) {
			const dataEntrada = new Date(entrada);
			const dataSaida = new Date(saida);

			if (Number(dataEntrada) > Number(dataSaida)) {
				setEntrada(saida);
			}
		} else {
			setEntrada(saida);
		}
	}, [saida]);

	return (
		<CadastroForm
			onSubmit={(e) => {
				e.preventDefault();

				onSubmit();
			}}
		>
			<div className={styles.etapa_retratil}>
				<div className={classesForm}>
					<InputContainer
						id="entrada"
						label="Horário entrada"
						error={erros.entrada}
					>
						<Input
							id="entrada"
							name="entrada"
							type="datetime-local"
							value={entrada}
							onChange={(e) => setEntrada(e.target.value)}
						/>
					</InputContainer>
					<InputContainer id="saida" label="Horário saida" error={erros.saida}>
						<Input
							id="saida"
							name="saida"
							type="datetime-local"
							value={saida}
							onChange={(e) => setSaida(e.target.value)}
						/>
					</InputContainer>
					<Botao fullWidth type="submit">
						<span>Adicionar</span>
						<FaPlus />
					</Botao>
				</div>
				{plantoes.length > 0 && (
					<div className={styles.plantoes}>
						{plantoes.map((p, i) => {
							return (
								<DiaPlantao
									key={i}
									data={p.entrada}
									onClick={() => {
										const plantoesNovos = plantoes.filter((_, index) => {
											return i != index;
										});

										setPlantoes(plantoesNovos);
									}}
								/>
							);
						})}
					</div>
				)}
			</div>
		</CadastroForm>
	);
}
