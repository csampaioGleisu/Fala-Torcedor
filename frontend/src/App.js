import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PieChart from "./components/Pie_Chart";
import TotalTorcedoresCard from "./components/Card_Torcedor";
import TreemapChart from "./components/TreeMap";
import LineChart from "./components/Line_Chart";
import BarChart from "./components/Bar_Chart";
import TotalEquipesCard from "./components/Card_Equipes";
import "./App.css"; // Importando o arquivo CSS

const App = () => {
    return (
        <div className="app-container">
            <Header />
            <main>
                <div className="chart-container">
                    <PieChart />
                </div>
                <div className="chart-container">
                    <TotalEquipesCard />
                </div>
                <div className="chart-container">
                    <TotalTorcedoresCard />
                </div>
                <div className="chart-container">
                    <TreemapChart />
                </div>
                <div className="chart-container">
                    <BarChart />
                </div>
                <div className="chart-container">
                    <LineChart />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
