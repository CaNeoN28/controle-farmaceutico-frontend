import { ReadonlyURLSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export function addSearchParam(
	chave: string,
	valor?: string,
	searchParams?: ReadonlyURLSearchParams,
	setParams?: Dispatch<SetStateAction<URLSearchParams>>
) {
	const params = new URLSearchParams(searchParams);

	if (valor) {
		params.set(chave, valor);
	} else {
		params.delete(chave);
	}

	if (setParams) setParams(params);
}
