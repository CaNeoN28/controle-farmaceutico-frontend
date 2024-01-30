"use client";

import "./globals.css";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Home() {
  const [texto, setTexto] = useState<string>("");

  return (
    <>
      <Input
        label="Label"
        id="input"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
        }}
        placeholder="AAAA"
        type="number"
      >
      </Input>
    </>
  );
}
