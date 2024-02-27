"use client";

import Menu from "@/components/Menu";
import styles from "./FarmaciasAdministracao.module.scss";
import redirecionarAutenticacao from "@/utils/redirecionarAutenticacao";
import TituloSecao from "@/components/TituloSecao";
import Paginacao from "@/components/Paginacao";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
	AdministracaoConfirmarFiltros,
	AdministracaoContainer,
	AdministracaoFiltros,
	AdministracaoItem,
	AdministracaoListagem,
	AdministracaoMain,
} from "@/components/Administracao";
import IFarmacia from "@/types/Farmacia";
import FetchFarmacia from "@/fetch/farmacias";
import { GetManyRequest } from "@/types/Requests";
import InputContainer from "@/components/InputContainer";
import Input from "@/components/Input";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface Filtros {
	nome_fantasia?: string;
	municipio?: string;
	estado?: string;
	pagina?: number;
	limite?: number;
}

export default function FarmaciasAdministracao() {
	redirecionarAutenticacao();

	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const fFarmacias = new FetchFarmacia();

	const { control, watch, handleSubmit } = useForm<Filtros>({
		defaultValues: {
			estado: "",
			municipio: "",
			nome_fantasia: "",
		},
	});

	const { pagina } = {
		pagina: Number(searchParams.get("pagina")) || 1,
	};

	const [params, setParams] = useState<URLSearchParams>(searchParams);
	const [maxPaginas, setMaxPaginas] = useState<number>(5);

	const [farmacias, setFarmacias] = useState<IFarmacia[]>([]);

	const submitFiltros: SubmitHandler<Filtros> = function (data) {
		const params = new URLSearchParams(searchParams);

		Object.keys(data).map((k) => {
			const key = k as keyof Filtros;
			const value = String(data[key]);

			if (value) {
				params.set(key, value);
			} else {
				params.delete(key);
			}
		});

		setParams(params);
	};

	function addSearchParam(chave: string, valor?: string) {
		const params = new URLSearchParams(searchParams);

		if (valor) {
			params.set(chave, valor);
		} else {
			params.delete(chave);
		}

		setParams(params);
	}

	async function getFarmacias() {
		const { estado, municipio, nome_fantasia }: Filtros = {
			estado: params?.get("estado") || "",
			municipio: params?.get("municipio") || "",
			nome_fantasia: params?.get("nome_fantasia") || "",
		};

		const filtros: Filtros = {
			pagina,
			limite: 10,
			estado,
			municipio,
			nome_fantasia,
		};

		await fFarmacias
			.getFarmacias(filtros)
			.then((res) => {
				const { dados, documentos_totais, paginas_totais } =
					res.data as GetManyRequest<IFarmacia[]>;

				if (dados.length == 0) {
					if (documentos_totais != 0) {
						addSearchParam("pagina", "1");
					} else {
						setMaxPaginas(0);
					}
				}

				setFarmacias(dados);
				setMaxPaginas(paginas_totais);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		getFarmacias();
	}, [pagina]);

	useEffect(() => {
		getFarmacias();
	}, [params]);

	useLayoutEffect(() => {
		if (params) {
			router.replace(`${pathname}?${params}`);
		}
	}, [params]);

	return (
		<>
			<Menu />
			<AdministracaoMain>
				<TituloSecao>LISTAGEM DE FARMÁCIAS</TituloSecao>
				<AdministracaoContainer>
					<AdministracaoFiltros onSubmit={handleSubmit(submitFiltros)}>
						<Controller
							name="nome_fantasia"
							control={control}
							render={({ field }) => {
								return (
									<InputContainer id="nome_fantasia" label="Nome">
										<Input id="nome_fantasia" {...{ ...field, ref: null }} />
									</InputContainer>
								);
							}}
						/>
						<Controller
							name="estado"
							control={control}
							render={({ field }) => {
								return (
									<InputContainer id="estado" label="Estado">
										<Input id="estado" {...{ ...field, ref: null }} />
									</InputContainer>
								);
							}}
						/>
						<Controller
							name="municipio"
							control={control}
							render={({ field }) => {
								return (
									<InputContainer id="estado" label="Estado">
										<Input id="estado" {...{ ...field, ref: null }} />
									</InputContainer>
								);
							}}
						/>
						<AdministracaoConfirmarFiltros onClean={() => {}} />
					</AdministracaoFiltros>
					{farmacias.length > 0 && (
						<AdministracaoListagem>
							{farmacias.map((f, i) => {
								return (
									<AdministracaoItem
										key={i}
										imagem_url={f.imagem_url}
										onDelete={() => {}}
										onEdit={() => {}}
									>
										{f.nome_fantasia}
									</AdministracaoItem>
								);
							})}
						</AdministracaoListagem>
					)}
				</AdministracaoContainer>
				{maxPaginas > 0 && (
					<Paginacao
						pagina={pagina}
						paginaMax={maxPaginas}
						setPagina={(v) => {
							addSearchParam("pagina", v.toString());
						}}
					/>
				)}
			</AdministracaoMain>
		</>
	);
}
