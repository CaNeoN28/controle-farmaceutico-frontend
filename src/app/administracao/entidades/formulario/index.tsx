import {
	CadastroBotoes,
	CadastroContainer,
	CadastroEtapa,
	CadastroForm,
	CadastroInputs,
} from "@/components/Cadastro";
import styles from "./FormularioEntidade.module.scss";
import Botao from "@/components/Botao";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import IEntidade from "@/types/Entidades";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import Select, { Opcao } from "@/components/Select";
import { fetchEstados } from "@/fetch/localizacao";
import { Estado } from "@/types/Localizacao";

interface Props {
	entidade?: IEntidade;
}

export default function FormularioEntidade({ entidade }: Props) {
	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<IEntidade>({
		defaultValues: entidade || {
			ativo: true,
			estado: "",
			municipio: "",
			nome_entidade: "",
		},
	});

	const [estados, setEstados] = useState<Opcao[]>([]);
	const [filtroEstado, setFiltroEstado] = useState("");

	const getEstados = async () => {
		await fetchEstados().then((res) => {
			const estados = res.data as Estado[];

			const opcoes: Opcao[] = estados
				.filter((e) => new RegExp(filtroEstado).test(e.nome))
				.sort((a, b) => (a.nome > b.nome ? 1 : -1))
				.map((e) => {
					return {
						label: e.nome,
						valor: e.nome,
					};
				});

			setEstados(opcoes);
		});
	};

	const onSubmit: SubmitHandler<IEntidade> = (data) => {
		console.log(data);
	};

	useEffect(() => {
		getEstados();
	}, [filtroEstado]);

	return (
		<CadastroContainer>
			<CadastroForm onSubmit={handleSubmit(onSubmit)}>
				<CadastroEtapa titulo="Dados da entidade">
					<CadastroInputs>
						<Controller
							control={control}
							name="nome_entidade"
							render={({ field }) => {
								return (
									<InputContainer
										id="nome_entidade"
										label="Nome da entidade"
										error={errors.nome_entidade}
									>
										<Input id="nome_entidade" {...{ ...field, ref: null }} />
									</InputContainer>
								);
							}}
						/>
						<Controller
							control={control}
							name="estado"
							render={({ field }) => {
								return (
									<InputContainer
										id="estado"
										label="Estado"
										error={errors.estado}
									>
										<Select
											id="estado"
											placeholder="Rondônia"
											filtro={filtroEstado}
											opcoes={estados}
											setFiltro={setFiltroEstado}
											setValue={setValue}
											{...{ ...field, ref: null }}
										/>
									</InputContainer>
								);
							}}
						/>
					</CadastroInputs>
				</CadastroEtapa>
				<CadastroBotoes>
					<Botao fullWidth type="submit">
						Salvar
					</Botao>
					<Botao fullWidth secundario>
						Cancelar
					</Botao>
				</CadastroBotoes>
			</CadastroForm>
		</CadastroContainer>
	);
}
