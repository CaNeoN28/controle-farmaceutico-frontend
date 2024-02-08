import { ReactNode } from "react"
import styles from "./Secao.module.scss"

interface Props{
  children?: ReactNode
}

export default function Secao({children}: Props){
  return <div className={styles.secao}>{children}</div>
}