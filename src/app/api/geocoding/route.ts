import { Coordenadas } from "@/types/Localizacao";
import axios from "axios";
import { NextRequest } from "next/server";

const { OPEN_WEATHER } = process.env;

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams

	const estado = searchParams.get("estado")
	const municipio = searchParams.get("municipio")

	let map_center: Coordenadas = { lat: 0, lng: 0 };

	if (estado && municipio)
		await axios
			.get(
				`http://api.openweathermap.org/geo/1.0/direct?q=${municipio},${estado},BR&limit=1&appid=${OPEN_WEATHER}`
			)
			.then((res) => {
				const [data] = res.data as { lat: number; lon: number }[];

				map_center = {
					lat: data.lat,
					lng: data.lon,
				};
			})
			.catch((err) => {
				console.log(err);
			});

	return Response.json(map_center);
}
