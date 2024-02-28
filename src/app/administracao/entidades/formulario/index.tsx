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

	const onSubmit: SubmitHandler<IEntidade> = (data) => {
		console.log(data);
	};

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
