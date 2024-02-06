import React from "react";
import { FaSearch } from "react-icons/fa";

interface Props extends React.ComponentPropsWithoutRef<"input"> {}

export default function InputPesquisa({ ...props }: Props) {
	return (
		<div>
			<input type="text" {...props} />
			<FaSearch />
		</div>
	);
}
