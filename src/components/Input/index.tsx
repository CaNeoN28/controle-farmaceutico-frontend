import React from "react";

interface Props extends React.ComponentPropsWithoutRef<"input"> {}

export default function Input({ ...props }: Props) {
  return <div>
    <input type="text" {...props}/>
  </div>;
}
