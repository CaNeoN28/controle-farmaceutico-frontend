"use client";

import DiaPlantao from "@/components/DiaPlantao";
import { useState } from "react";

export default function Teste() {
  const [dias, setDias] = useState([
    "2020/10/10",
    "2020/10/11",
    "2020/10/12",
    "2020/10/13",
    "2020/10/14",
    "2020/10/15",
    "2020/10/16",
    "2020/10/17",
    "2020/10/18",
    "2020/10/19",
  ])

	return <div>
		{dias.map((dia, index) => 
      <DiaPlantao key={index} data={dia} onClick={() => {
        const filtros = dias.filter((d, i) => i != index)
        setDias(filtros)
      }}/>
    )}
	</div>;
}
