import React from "react";
import InputMask from "react-input-mask";
import styles from "./InputMascara.module.scss";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  mask: string;
}

export default function InputMascara({ mask, ...props }: Props) {
  return <InputMask className={styles.input} mask={mask} {...props} />;
}
