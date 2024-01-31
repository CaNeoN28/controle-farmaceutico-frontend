"use client";

import Input from "@/components/Input";
import "./globals.css";
import InputContainer from "@/components/InputContainer";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Botao from "@/components/Botao";

export default function Home() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    input: string;
  }>({
    defaultValues: {
      input: "",
    },
  });

  const onSubmit: SubmitHandler<{ input: string }> = (data) => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer id="input" label="Label" error={errors.input}>
          <Controller
            name="input"
            control={control}
            rules={{
              required: { message: "Obrigatório", value: true },
              minLength: { message: "Mínimo 3", value: 3 },
            }}
            render={({ field }) => (
              <Input {...{ ...field, ref: null }} id="input" />
            )}
          />
        </InputContainer>
        <Botao>Aperte</Botao>
      </form>
    </>
  );
}
