"use client";

import Menu from "@/components/Menu";
import React, { useEffect, useLayoutEffect, useState } from "react";
import "./globals.css";
import styles from "./Home.module.scss";
import TituloFarmacia from "@/components/TituloFarmacia";
import Botao from "@/components/Botao";
import FarmaciaItem from "@/components/FarmaciaItem";
import FarmaciaFetch from "@/fetch/farmacias";
import { GetManyRequest } from "@/types/Requests";
import Farmacia, { Escala } from "@/types/Farmacia";
import { getDayFromNum } from "@/types/DiasSemana";
import Map from "@/components/Map";

interface Localizacao {
  lng: number;
  lat: number;
}

type FarmaciaEscala = Array<Farmacia & { dia_semana: string }>;

export default function Home() {
  const fFarmacias = new FarmaciaFetch();

  const [date, setDate] = useState(new Date());

  const [localizacao, setLocalizacao] = useState<Localizacao>();
  const [erroLocalizacao, setErroLocalizacao] = useState<string>();

  const [farmaciaMaisProxima, setFarmaciaMaisProxima] = useState<Farmacia>();
  const [farmaciasProximas, setFarmaciasProximas] = useState<Farmacia[]>([]);
  const [farmaciasProximasF, setFarmaciasProximasF] = useState<Farmacia[]>([]);
  const [farmaciasEscala, setFarmaciasEscala] = useState<FarmaciaEscala>([]);
  const [farmaciasEscalaF, setFarmaciasEscalaF] = useState<FarmaciaEscala>([]);

  const [numFarmacias, setNumFarmacias] = useState<number>(5);

  const getFarmacias = () => {
    if (localizacao) {
      const { lat, lng } = localizacao;

      fFarmacias
        .getFarmaciasProximas({
          limite: 6,
          tempo: date,
          latitude: lat,
          longitude: lng,
        })
        .then((res) => {
          const resposta = res.data as GetManyRequest<Farmacia[]>;
          const farmacias = resposta.dados;

          setFarmaciaMaisProxima(farmacias[0]);
          setFarmaciasProximas(farmacias);
        });

      fFarmacias
        .getFarmaciasPlantoes({
          limite: numFarmacias,
          tempo: date,
        })
        .then((res) => {
          const resposta = res.data as GetManyRequest<Escala>;
          const escala = resposta.dados;

          const farmacias: Array<Farmacia & { dia_semana: string }> = [];

          Object.keys(escala).map((e) => {
            escala[e].map((f) => {
              const dia = new Date(e);

              const { d, m, y } = {
                d: String(dia.getDate()),
                m: String(dia.getMonth() + 1),
                y: String(dia.getFullYear()),
              };

              const dia_semana = `${d.padStart(2, "0")}/${m.padStart(
                2,
                "0"
              )}/${y.padStart(4, "0")}`;

              farmacias.push({
                ...f,
                dia_semana,
              });
            });
          });

          setFarmaciasEscala(farmacias);
        });
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setLocalizacao({
            lat: latitude,
            lng: longitude,
          });
        },
        (error) => {
          setErroLocalizacao("Não foi possível rastrear sua localização");

          setLocalizacao({
            lat: 0,
            lng: 0,
          });
        }
      );
    } else {
      setErroLocalizacao("Geolocalização não permitida no navegador");
    }
  };

  const tracarRota = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (localizacao && farmaciaMaisProxima) {
      const url = `https://www.google.com/maps/dir/${localizacao.lat},${localizacao.lng}/${farmaciaMaisProxima.endereco.localizacao.x},${farmaciaMaisProxima.endereco.localizacao.y}`;

      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    getLocation();

    const getMaxFarmacias = () => {
      const width = window.innerWidth;

      if (width > 1680) {
        setNumFarmacias(5);
      } else if (width > 1280) {
        setNumFarmacias(4);
      } else {
        setNumFarmacias(3);
      }
    };

    getMaxFarmacias();

    window.addEventListener("resize", getMaxFarmacias);
    return () => window.removeEventListener("resize", getMaxFarmacias);
  }, []);

  useEffect(() => {
    getFarmacias();
  }, [localizacao]);

  useEffect(() => {
    setFarmaciasProximasF(farmaciasProximas.slice(1, numFarmacias + 1));
  }, [farmaciasProximas]);

  useEffect(() => {
    setFarmaciasEscalaF(farmaciasEscala.slice(0, numFarmacias));
  }, [farmaciasEscala]);

  useLayoutEffect(() => {
    setFarmaciasProximasF(farmaciasProximas.slice(1, numFarmacias + 1));
    setFarmaciasEscalaF(farmaciasEscala.slice(0, numFarmacias));
  }, [numFarmacias]);

  return (
    <>
      <Menu />
      <main className={styles.main}>
        {farmaciaMaisProxima && (
          <div className={styles.farmacia_proxima}>
            <div className={styles.farmacia}>
              <div className={styles.map}>
                {erroLocalizacao ? (
                  <span className={styles.erro}>{erroLocalizacao}</span>
                ) : (
                  <Map
                    map_center={{
                      lat: Number(farmaciaMaisProxima.endereco.localizacao.x),
                      lng: Number(farmaciaMaisProxima.endereco.localizacao.y),
                    }}
                  />
                )}
              </div>
              <TituloFarmacia>
                <div className={styles.info}>
                  <span>{farmaciaMaisProxima.nome_fantasia}</span>
                  <span>Farmácia aberta mais próxima</span>
                </div>
              </TituloFarmacia>
            </div>
            <Botao fullWidth onClick={tracarRota}>
              Traçar Rota
            </Botao>
          </div>
        )}
        {farmaciasProximasF.length > 0 && (
          <div className={styles.listagem}>
            <span className={styles.title}>Outras farmácias abertas</span>
            <div className={styles.items}>
              {farmaciasProximasF.map((f, i) => {
                const dia = f.horarios_servico[getDayFromNum(date.getDay())];

                return (
                  <FarmaciaItem
                    key={i}
                    informacao={`${dia.horario_entrada} - ${dia.horario_saida}`}
                    nome={f.nome_fantasia}
                    para={`/farmacias/${f._id}`}
                  />
                );
              })}
            </div>
            <Botao secundario fullWidth>
              Ver mais
            </Botao>
          </div>
        )}
        {farmaciasEscalaF.length > 0 && (
          <div className={styles.listagem}>
            <span className={styles.title}>Plantões nos próximos dias</span>
            <div className={styles.items}>
              {farmaciasEscalaF.map((f, i) => (
                <FarmaciaItem
                  key={i}
                  informacao={f.dia_semana}
                  nome={f.nome_fantasia}
                  para={`/farmacias/${f._id}`}
                />
              ))}
            </div>
            <Botao secundario fullWidth>
              Ver mais
            </Botao>
          </div>
        )}
      </main>
    </>
  );
}
