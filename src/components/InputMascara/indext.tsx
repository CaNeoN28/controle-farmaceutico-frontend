import React from "react";
import InputMask from "react-input-mask";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  mask: string;
}

export default function InputMascara({ mask, ...props }: Props) {
  return <InputMask mask={mask} {...props} />;
}
