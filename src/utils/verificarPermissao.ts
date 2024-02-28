import { Funcao } from "@/types/Usuario";

const FUNCOES : Funcao[] = ["ADMINISTRADOR", "GERENTE", "USUARIO", "INATIVO"]

export default function verificarPermissao(funcao: Funcao, minimo: Funcao){
	const funcaoN = FUNCOES.findIndex(v => v === funcao)
	const minimoN = FUNCOES.findIndex(v => v === minimo)

	return minimo >= funcao
}