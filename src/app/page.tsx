"use client";

import "./globals.css";
import Input from "@/components/Input";
import { FaSearch } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <Input label="Label" id="input" placeholder="AAAA">
        <FaSearch />
      </Input>
    </>
  );
}
