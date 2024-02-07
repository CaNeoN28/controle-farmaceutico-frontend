import { ComponentPropsWithoutRef, MouseEventHandler, ReactNode } from "react";

interface Props {
	children?: ReactNode;
}

export default function Pagina({
	children,
	onClick,
	...props
}: Props & ComponentPropsWithoutRef<"button">) {
	return (
		<button
			onClick={(e) => {
				e.preventDefault();
				onClick && onClick(e);
			}}
			
			{...props}
		>
			{children}
		</button>
	);
}
