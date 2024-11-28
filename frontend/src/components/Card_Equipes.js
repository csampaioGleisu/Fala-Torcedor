import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/cards.module.css";

const TotalEquipesCard = () => {
  const [totalequipes, setTotalequipes] = useState(0);

  useEffect(() => {
    // Função para buscar o total de torcedores do backend
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/torcedores/times/total"
        );

        setTotalequipes(response.data.total);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.card_container}>
      <h2>Total de Equipes</h2>
      <div className={styles.card}>
        <span className={styles.total_text}>{totalequipes}</span>
      </div>
    </div>
  );
};

export default TotalEquipesCard;
