export interface FiltrosFarmaciasProximas {
	pagina?: number;
	limite?: number;
	latitude: number;
	longitude: number;
	tempo?: Date;
	estado?: string,
	municipio?: string,
}