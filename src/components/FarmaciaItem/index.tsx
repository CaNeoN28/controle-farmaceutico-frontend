import { MdLocalPharmacy } from "react-icons/md";
import styles from "./FarmaciaItem.module.scss";

interface Props {
  nome: string;
  informacao: string;
  imagem_url?: string;
}

export default function FarmaciaItem({ informacao, nome, imagem_url }: Props) {
  return (
    <div className={styles.item}>
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
    </div>
  );
}
