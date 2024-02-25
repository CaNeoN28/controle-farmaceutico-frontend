export default interface Endereco {
	cep: string;
	estado: string;
	municipio: string;
	bairro: string;
	logradouro: string;
	numero: string;
	localizacao: {
		x: number;
		y: number;
	};
}
