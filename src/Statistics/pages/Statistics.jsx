import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Statistics.css";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Statistics = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [percentageDish, setPercentageDish] = useState([]);
  const [mostPopularDish, setMostPopularDish] = useState(null);
  const [totalWeekProfit, setTotalWeekProfit] = useState();
  const [topDishes, setTopDishes] = useState([]);
  const [ordersLastWeek, setOrdersLastWeek] = useState([]);

  const theme = useTheme();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const responseDataStats = await sendRequest(
          "http://localhost:8000/api/statistics/percentage-stats"
        );
        const transformedData = Object.entries(
          responseDataStats.dishPercentage
        ).map(([label, value], index) => ({
          id: index,
          value,
          label,
        }));
        console.log(responseDataStats.dishPercentage);
        console.log(transformedData);
        setPercentageDish(transformedData);

        const fetchTotalWeekProfit = await sendRequest(
          `http://localhost:8000/api/statistics/total-week-profit`,
          "GET"
        );
        // console.log(fetchTotalWeekProfit)
        setTotalWeekProfit(fetchTotalWeekProfit.totalProfit);
        console.log("total week: " + totalWeekProfit);

        const fetchOrdersLastWeek = await sendRequest(
          "http://localhost:8000/api/statistics/last-week-stats"
        );
        setOrdersLastWeek(fetchOrdersLastWeek); // Oczekujemy, że odpowiedź będzie zawierała dane zamówień
        

        const responseDataPopularity = await sendRequest(
          "http://localhost:8000/api/statistics/most-popular-dish"
        );
        setMostPopularDish({
          name: responseDataPopularity.mostPopularDish,
          count: responseDataPopularity.mostPopularDishCount,
        });
        setTopDishes(responseDataPopularity.topDishes);
        console.log("topDishes: " + topDishes);
        console.log("mostPopularDish: " + mostPopularDish);
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
      const newR = Math.max(rgbValues[0] - i * darkenFactor, 0);
      const newG = Math.max(rgbValues[1] - i * darkenFactor, 0);
      const newB = Math.max(rgbValues[2] - i * darkenFactor, 0);

      const newColor = `rgb(${newR}, ${newG}, ${newB})`;
      colors.push(newColor);
    }

    return colors; // Zwracamy tablicę kolorów
  }

  const initialColor = "rgb(117, 148, 215)";
  const steps = 10;
  const result = darkenColor(initialColor, steps);

  return (
    <div>
      
    <ErrorModal error={error} onClear={clearError} />
    {/* {isLoading && <LoadingSpinner asOverlay />} */}
    {/* {!isLoading && ( */}
    <div className="container-statistics">
      <Navbar />
      {console.log(ordersLastWeek)}
      {/* <div className="content"> */}
      <div className="grid-container2">
        <div className="ranking">
          <h2>Wykres ilosci zamowien w ostatnim tygodniu</h2>
          <div className="pie-chart-statistics">
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
                      fill: "rgb(117, 148, 215)",
                    },
                    [`& .${gaugeClasses.referenceArc}`]: {
                      fill: theme.palette.text.disabled,
                    },
                  })}
                  value={totalWeekProfit}
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
                      fill: "rgb(117, 148, 215)",
                    },
                    [`& .${gaugeClasses.referenceArc}`]: {
                      fill: theme.palette.text.disabled,
                    },
                  })}
                  value={ordersLastWeek.totalOrders}
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
          <div className="pie-chart-statistics-placeholder">
            <ul>
              <div className="cart-item3-placeholder">
                <span className="pop-dish-name">nazwa</span>
                <span className="pop-dish-name">ilosc</span>
                <span className="pop-dish-name">cena</span>
              </div>
              {topDishes.map((dish, index) => (
                <li key={index} className="cart-item3">
                  <span className="pop-dish-name">{dish.name}</span>
                  <span className="pop-dish-weight">x {dish.count}</span>
                  <span className="pop-dish-category">{dish.revenue}zl</span>
                  {/* - {dish.count} zamówień, przychód: {dish.revenue} */}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="ranking">
          {ordersLastWeek.data && (
            <>
            <h2>Wykres ilosci zamowien w ostatnim tygodniu</h2>
          <div className="pie-chart-statistics">
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: ordersLastWeek.dataDays, // 7 dni tygodnia
                  
                  legend: {
                    text: {
                      fill: "white",
                    },
                  },
                  ticks: {
                    line: {
                      stroke: "white",
                      strokeWidth: 1,
                    },
                    text: {
                      fill: "white",
                    },
                  },
                },
              ]}
              series={[
                {
                  data: ordersLastWeek.data,
                  // data: [1,2,3,4,56,7,7],
                  color: "rgb(117, 148, 215)",
                }, // Kolor i dane dla kolumn
              ]}
              colors={{ scheme: "nivo" }}
              // width={600}
              height={300}
              />
          </div>
          </>
    )}
          </div>
        </div>
      {/* </div> */}
    </div>
    {/* )} */}
    </div>
  );
};

export default Statistics;
