import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const BarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Substitua pela URL correta do seu backend
        const response = await fetch("http://localhost:3001/torcedores/torcedores/top10");
        const { data } = await response.json();

        // Processa os dados para categorias e valores
        setCategories(data.map(item => item.equipe));  // Extraímos o nome da equipe
        setChartData(data.map(item => parseInt(item.total)));  // Convertendo 'total' para número
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4, // Bordas arredondadas
        borderRadiusApplication: "end", // Aplicação no final das barras
        horizontal: true, // Gráfico horizontal
      },
    },
    dataLabels: {
      enabled: false, // Desativa os rótulos nos dados
    },
    xaxis: {
      categories: categories, // Categorias (nomes das equipes)
    },
  };

  return (
    <div>
      {loading ? (
        <p>Carregando gráfico...</p>
      ) : (
        <Chart
          options={options}
          series={[{ data: chartData }]} // Quantidade de torcedores (convertida para número)
          type="bar"
          height={350}
        />
      )}
    </div>
  );
};

export default BarChart;
