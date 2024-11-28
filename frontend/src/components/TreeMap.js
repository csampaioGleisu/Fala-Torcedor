import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const TreemapChart = () => {
  const [series, setSeries] = useState([]);

  // Função para buscar dados do backend
  const fetchDistribuicaoPorEstado = async () => {
    try {
      const response = await fetch("http://localhost:3001/torcedores/torcedores/distribuicao_estado");
      const data = await response.json();
      setSeries([
        {
          data: data.data, // Dados no formato [{ x: 'Estado', y: total }]
        },
      ]);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchDistribuicaoPorEstado();
  }, []);

  // Configuração do gráfico
  const options = {
    chart: {
      type: "treemap",
      height: 350,
    },
    title: {
      text: "Distribuição Geográfica de Torcedores por Estado",
      align: "center",
    },
    colors: [
      "#3B93A5",
      "#F7B844",
      "#ADD8C7",
      "#EC3C65",
      "#CDD7B6",
      "#C1F666",
      "#D43F97",
      "#1E5D8C",
      "#421243",
      "#7F94B0",
      "#EF6537",
      "#C0ADDB",
    ],
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
      },
    },
    legend: {
      show: false,
    },
  };

  return (
    <div style={{backgroundColor : "green" }}>
      {series.length > 0 ? (
        <ReactApexChart options={options} series={series} type="treemap" height={350} />
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
};

export default TreemapChart;
