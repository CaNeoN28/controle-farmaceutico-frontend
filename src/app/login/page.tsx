"use client";

import InputContainer from "@/components/InputContainer";
import styles from "./Login.module.scss";
import Menu from "@/components/Menu";
import Input from "@/components/Input";
import InputSenha from "@/components/InputSenha";
import Botao from "@/components/Botao";

export default function Login() {
  return (
    <>
      <Menu />
      <main className={styles.main}>
        <div className={styles.container}>
          <span className={styles.titulo}>LOGIN</span>
          <form className={styles.form}>
            <InputContainer id="email" label="Email">
              <Input id="email" />
            </InputContainer>
            <InputContainer id="senha" label="Senha">
              <InputSenha id="senha" />
            </InputContainer>
          </form>
          <div className={styles.botoes}>
            <Botao fullWidth secundario>Esqueci a senha</Botao>
            <Botao fullWidth>Login</Botao>
          </div>
        </div>
      </main>
    </>
  );
}
