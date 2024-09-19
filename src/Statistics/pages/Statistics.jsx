import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Statistics.css";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";

const Statistics = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [percentageDish, setPercentageDish] = useState([]);
  const [mostPopularDish, setMostPopularDish] = useState(null);
  const [topDishes, setTopDishes] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Fetch percentage stats for PieChart
        const responseDataStats = await sendRequest(
          "http://localhost:5000/api/statistics/percentage-stats"
        );
        const transformedData = Object.entries(
          responseDataStats.dishPercentage
        ).map(([label, value], index) => ({
          id: index,
          value,
          label,
        }));
        setPercentageDish(transformedData);

        // Fetch most popular dishes and ranking
        const responseDataPopularity = await sendRequest(
          "http://localhost:5000/api/statistics/most-popular-dish"
        );
        setMostPopularDish({
          name: responseDataPopularity.mostPopularDish,
          count: responseDataPopularity.mostPopularDishCount,
        });
        setTopDishes(responseDataPopularity.topDishes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStatistics();
  }, [sendRequest]);

  function darkenColor(rgbColor, steps) {
    // Parse the input RGB color
    const rgbValues = rgbColor.match(/\d+/g).map(Number);

    const colors = [];
    const darkenFactor = 30; // How much to darken each step

    for (let i = 0; i < steps; i++) {
      // For each step, reduce the RGB values, ensuring they don't go below 0
      const newR = Math.max(rgbValues[0] - i * darkenFactor, 0);
      const newG = Math.max(rgbValues[1] - i * darkenFactor, 0);
      const newB = Math.max(rgbValues[2] - i * darkenFactor, 0);

      // Format the new color and push to the array
      const newColor = `rgb(${newR}, ${newG}, ${newB})`;
      colors.push(newColor);
    }

    return colors; // Zwracamy tablicę kolorów
  }

  const initialColor = "rgb(102, 102, 255)";
  const steps = 10;
  const result = darkenColor(initialColor, steps);

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <div className="grid-container2">
          <div className="ranking">
            <h2>Wykres ilosci zamowien w ostatnim tygodniu</h2>
            <div className="pie-chart">
              <PieChart
                colors={result}
                series={[
                  {
                    data: percentageDish,
                    arcLabel: (item) => `${item.value}%`, // Etykiety
                    arcLabelMinAngle: 35,
                    arcLabelRadius: "60%",
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                sx={{
                  "& .MuiChartsLegend-series text": {
                    fontSize: "0.9em !important",
                    fontWeight: "bold",
                  },
                  [`& .${pieArcLabelClasses.root}`]: {
                    fontWeight: "bold",
                    fill: "white",
                  },
                }}
                height={250}
              />
            </div>
          </div>
          <div className="ranking">
            <h2>Wykres ilosci zamowien wff ostatnim tygodniu</h2>
            <div className="ranking2">
              <div className="gauge-item">
                <div className="gauge-item2">
                  <Gauge
                    sx={(theme) => ({
                      [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 40,
                      },
                      [`& .${gaugeClasses.valueArc}`]: {
                        fill: "rgb(102, 102, 255)",
                      },
                      [`& .${gaugeClasses.referenceArc}`]: {
                        fill: theme.palette.text.disabled,
                      },
                    })}
                    value={75}
                    startAngle={0}
                    endAngle={360}
                    innerRadius="80%"
                    outerRadius="100%"
                  />
                </div>
                <span>dzisiejszy przychód</span>
              </div>
              <div className="gauge-item">
                <div className="gauge-item2">
                  <Gauge
                    sx={(theme) => ({
                      [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 40,
                      },
                      [`& .${gaugeClasses.valueArc}`]: {
                        fill: "rgb(102, 102, 255)",
                      },
                      [`& .${gaugeClasses.referenceArc}`]: {
                        fill: theme.palette.text.disabled,
                      },
                    })}
                    value={75}
                    startAngle={0}
                    endAngle={360}
                    innerRadius="80%"
                    outerRadius="100%"
                    // ...
                  />
                </div>
                <span>Ilość zamówień dzisiaj</span>
              </div>
            </div>
          </div>
          <div className="ranking">
            <h2>Ranking 7 najpopularniejszych dań</h2>
            <div className="pie-chart">
              <ul>
                <div className="cart-item2">
                  <span className="item-name">nazwa</span>
                  <span className="item-weight">ilosc</span>
                  <span className="item-category">cena</span>
                </div>
                {topDishes.map((dish, index) => (
                  <li key={index}>
                    <span>{dish.name}</span>
                    <span>x {dish.count}</span>
                    <span>{dish.revenue}zl</span>
                    {/* - {dish.count} zamówień, przychód: {dish.revenue} */}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="ranking">
            <h2>Wykres ilosci zamowien w ostatnim tygodniu</h2>
            <div className="pie-chart">
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: ["pon", "wt", "śr", "czw", "pt", "sob", "nie"], // 7 dni tygodnia
                    sx: {
                      ".MuiChartsAxis-root.MuiChartsXAxis-root": {
                        color: "white", // Kolor tekstu
                        fontSize: "16px",
                      },
                    },
                  },
                ]}
                series={[
                  {
                    data: [44, 37, 72, 55, 65, 80, 60],
                    color: "rgb(102, 102, 255)",
                  }, // Kolor i dane dla kolumn
                ]}
                width={600}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
