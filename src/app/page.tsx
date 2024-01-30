"use client";

import "./globals.css";
import Input from "@/components/Input";
import InputContainer from "@/components/InputContainer";
import { useState } from "react";

export default function Home() {
  const [texto, setTexto] = useState<string>("");

  return (
    <>
      <InputContainer id="input" label="Label">
        <Input
          id="input"
          placeholder="aaa"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
          }}
        />
      </InputContainer>
    </>
  );
}
