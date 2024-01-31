"use client";

import Input from "@/components/Input";
import "./globals.css";
import InputContainer from "@/components/InputContainer";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Botao from "@/components/Botao";
import InputSenha from "@/components/InputSenha";
import InputMascara from "@/components/InputMascara/indext";

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
        <InputContainer id="input" label="Label" error={errors.input} fullWidth>
          <Controller
            name="input"
            control={control}
            rules={{
              required: { message: "Obrigatório", value: true },
              minLength: { message: "Mínimo 3", value: 3 },
            }}
            render={({ field }) => (
              <InputMascara mask="aaa.999.999" {...{...field, ref: null}}/>
            )}
          />
        </InputContainer>
        <Botao>Aperte</Botao>
      </form>
    </>
  );
}
