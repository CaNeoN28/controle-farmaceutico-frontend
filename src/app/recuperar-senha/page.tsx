"use client";

import Menu from "@/components/Menu";
import styles from "./RecuperarSenha.module.scss";
import CenterBox from "@/components/CenterBox";

interface Params {
  token?: string;
}

export default function RecuperarSenha({ params }: { params: Params }) {
  const { token } = params;

  return (
    <>
      <Menu />
      <main className={styles.main}>
        <CenterBox>
          
        </CenterBox>
      </main>
    </>
  );
}
