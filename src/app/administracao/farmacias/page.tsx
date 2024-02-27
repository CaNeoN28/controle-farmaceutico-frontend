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

export default function FarmaciasAdministracao() {
	redirecionarAutenticacao();

	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const { pagina, nome_fantasia } = {
		pagina: Number(searchParams.get("pagina")) || 1,
		nome_fantasia: searchParams.get("nome") || "",
	};

	const fFarmacias = new FetchFarmacia();

	const [params, setParams] = useState<URLSearchParams>();
	const [maxPaginas, setMaxPaginas] = useState<number>(5);

	const [farmacias, setFarmacias] = useState<IFarmacia[]>([]);

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
		await fFarmacias
			.getFarmacias({ pagina, nome_fantasia })
			.then((res) => {
				const { dados, paginas_totais } = res.data as GetManyRequest<
					IFarmacia[]
				>;

				if (dados.length > 0) {
					setFarmacias(dados);
				}

				setMaxPaginas(paginas_totais);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		getFarmacias();
	}, [pagina]);

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
					<AdministracaoFiltros onSubmit={() => {}}>
						<InputContainer id="nome_fantasia" label="Nome">
							<Input id="nome_fantasia" />
						</InputContainer>
						<InputContainer id="estado" label="Estado">
							<Input id="estado" />
						</InputContainer>
						<InputContainer id="municipio" label="Municipio">
							<Input id="municipio" />
						</InputContainer>
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
				<Paginacao
					pagina={pagina}
					paginaMax={maxPaginas}
					setPagina={(v) => {
						addSearchParam("pagina", v.toString());
					}}
				/>
			</AdministracaoMain>
		</>
	);
}
