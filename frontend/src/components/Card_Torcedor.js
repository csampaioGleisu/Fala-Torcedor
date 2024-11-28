import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/cards.module.css"; 

const TotalTorcedoresCard = () => {
  const [totalTorcedores, setTotalTorcedores] = useState(0);

  useEffect(() => {
    // Função para buscar o total de torcedores do backend
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/torcedores/torcedores/series"
        );

        // Calcula o total de torcedores
        const total = response.data.reduce(
          (sum, item) => sum + parseInt(item.total),
          0
        );

        setTotalTorcedores(total);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.card_container}>
      <h2>Total de Torcedores</h2>
      <div className={styles.card}>
        <span className={styles.total_text}>{totalTorcedores}</span>
      </div>
    </div>
  );
};

export default TotalTorcedoresCard;
