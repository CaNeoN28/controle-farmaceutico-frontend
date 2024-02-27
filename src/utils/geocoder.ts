import Endereco from "@/types/Endereco";
import { Coordenadas } from "@/types/Localizacao";

export async function EncontrarCoordenada(
  endereco: Endereco & { nome_farmacia: string }
) {
  const geocoder = new google.maps.Geocoder();

  const { cep, estado, municipio, bairro, logradouro, numero, nome_farmacia } =
    endereco;
  const pesquisa = [
    cep,
    estado,
    municipio,
    bairro,
    logradouro,
    numero,
    nome_farmacia,
  ].join(" ");

  let map_center: Coordenadas = { lat: 0, lng: 0 };

  await geocoder
    .geocode({ address: pesquisa })
    .then((res) => {
      const resultado = res.results[0].geometry.location.toJSON();

      if (
        resultado.lat != map_center?.lat &&
        resultado.lng != map_center?.lng
      ) {
        map_center = resultado;
      }
    })
    .catch(() => {});

  return map_center;
}
