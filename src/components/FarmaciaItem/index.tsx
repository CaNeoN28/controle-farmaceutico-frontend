import { MdLocalPharmacy } from "react-icons/md";
import styles from "./FarmaciaItem.module.scss";
import classNames from "classnames";
import Link from "next/link";

interface Props {
  nome: string;
  informacao: string;
  para: string;
  imagem_url?: string;
}

export default function FarmaciaItem({ informacao, nome, para, imagem_url }: Props) {
  const classes = classNames({
    [styles.item]: true,
    "box-shadow": true
  })
  return (
    <Link href={para} className={classes}>
      <div className={styles.imagem}>
        {imagem_url ? (
          <img />
        ) : (
          <span className={styles.placeholder}>
            <MdLocalPharmacy />
          </span>
        )}
      </div>
      <div className={styles.conteudo}>
        <span>{nome}</span>
        <span>{informacao}</span>
      </div>
    </Link>
  );
}
