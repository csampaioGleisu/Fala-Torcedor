import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';
import axios from 'axios';
import styles from '../styles/piecharts.module.css'

const PieChart = () => {
  const [chartData, setChartData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  
  useEffect(() => {
    // Função para buscar dados no backend
    const fetchData = async () => {
      try {
        // A URL da sua API que retorna o número de torcedores por série
        const response = await axios.get('http://localhost:3001/torcedores/torcedores/series');
        
        // Mapear os dados da resposta para extrair as séries e totais
        const series = response.data.map(item => parseInt(item.total)); // Converter para número
        const labels = response.data.map(item => item.serie);  // Extrair as séries
        
        setChartData(series);
        setChartLabels(labels);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    chart: {
      type: 'donut', // Tipo do gráfico
      width: '100%',
    },
    labels: chartLabels,  // As labels que serão as séries
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <div id='pie-graphic' className={styles.chartcontainer}>
      <h2>Distribuição de Torcedores por Série</h2>
      <div className="chart-container" id="chart">
        <ApexCharts
          options={options}
          series={chartData} // Dados do gráfico
          type="donut"
          height={200}
        />
      </div>
    </div>
  );
};

export default PieChart;
