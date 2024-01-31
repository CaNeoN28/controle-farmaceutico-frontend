"use client";

import Input from "@/components/Input";
import "./globals.css";
import InputContainer from "@/components/InputContainer";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Botao from "@/components/Botao";

export default function Home() {
  const { register, handleSubmit, control } = useForm<{
    input: string;
  }>({defaultValues: {
    input: ""
  }});

  const onSubmit: SubmitHandler<{ input: string }> = (data) => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer id="input" label="Label">
          <Controller
            name="input"
            control={control}
            render={({ field }) => <Input {...{...field, ref: null}} id="input" />}
          />
        </InputContainer>
        <Botao>
          Aperte
        </Botao>
      </form>
    </>
  );
}
