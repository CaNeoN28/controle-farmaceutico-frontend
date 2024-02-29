import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface LimparFiltrosProps {
	router: AppRouterInstance;
	pathname: string;
	watch: UseFormWatch<any>;
	setValue: UseFormSetValue<any>;
	setParams: Dispatch<SetStateAction<URLSearchParams>>;
}

export function limparFiltros({
	router,
	pathname,
	setValue,
	watch,
	setParams,
}: LimparFiltrosProps) {
	return () => {
		const newParams = new URLSearchParams();
		const dados = watch();

		Object.keys(dados).map((k) => {
			setValue(k, "");
			newParams.delete(k);
		});

		setParams(newParams);
		router.replace(`${pathname}`);
	};
}
