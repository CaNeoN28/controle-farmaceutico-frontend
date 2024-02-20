export interface FiltrosFarmaciasProximas {
	pagina?: number;
	limite?: number;
	latitude: number;
	longitude: number;
	tempo?: Date;
	estado?: string,
	municipio?: string,
}

export interface FiltrosPlantoes {
	pagina?: number;
	limite?: number;
	municipio?: string;
	estado?: string;
	tempo?: Date;
}