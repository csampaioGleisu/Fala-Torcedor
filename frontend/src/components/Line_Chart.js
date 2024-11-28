import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import styles from "../styles/linecharts.module.css"

const LineChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar dados do backend
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3001/torcedores/torcedores/filiacoes");
        const { data } = await response.json();

        // Ajuste para formatação do eixo x (anos)
        setChartData(data);
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
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    title: {
      text: "Filiações ao longo do tempo",
      align: "left",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      title: {
        text: "Número de Filiações",
      },
    },
    xaxis: {
      type: "category",
      title: {
        text: "Ano",
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
    },
  };

  return (
    <div className={styles.linecontainer}>
      {loading ? (
        <p>Carregando gráfico...</p>
      ) : (
        <Chart
          options={options}
          series={[
            {
              name: "Filiações",
              data: chartData, // Os dados formatados corretamente com "x" como ano
            },
          ]}
          type="area"
          height={350}
        />
      )}
    </div>
  );
};

export default LineChart;
