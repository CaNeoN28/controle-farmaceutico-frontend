interface Params {
	id: string;
}

export default function Farmacia({ params }: { params: Params }) {
	const { id: farmaciaId } = params;

	return <>{farmaciaId}</>;
}
