import React from "react";

interface Props extends React.ComponentPropsWithoutRef<"input"> {}

export default function InputImagem({ ...props }: Props) {
  return (
    <>
      <input type="file" {...props} />
    </>
  );
}
