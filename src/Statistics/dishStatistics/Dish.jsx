import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { darkenColor } from "../../shared/helpers/darkenColor";
import { LineChart } from "@mui/x-charts/LineChart";
import Navbar from "../components/Navbar";
import './Dish.css'

const Dish = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [dishData, setDishData] = useState(null);
  const [dishLeftData, setDishLeftData] = useState(null);
  const [dishesWeekDays, setDishesWeekDays] = useState();
  const location = useLocation();
  const { dishId } = location.state || {};
  const auth = useContext(AuthContext);
  const [customWeights, setCustomWeights] = useState({});
  const [periodWeekDays, setPeriodWeekDays] = useState("tydzien");
  const [periodTotal, setPeriodTotal] = useState("tydzien");
  const [periodProfit, setPeriodProfit] = useState("tydzien");
  const [dishTotal, setDishTotal] = useState([]);
  const initialColor = "rgb(117, 148, 215)";
  const steps = 10;
  const result = darkenColor(initialColor, steps);

  const prepareIngredientsData = (data) => {
    return Object.entries(data).map(([name, itemData], index) => ({
      id: index,
      value: parseFloat(itemData.percentage),
      label: name,
    }));
  };

  const fetchDishData = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:8000/api/statistics/dishes/dish-revenue/${dishId}`,
        "POST",
        JSON.stringify({ period: periodProfit }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      console.log("response data");
      console.log(responseData);
      setDishData(responseData);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDishLeftData = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:8000/api/statistics/dishes/dishes-left/${dishId}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );

      setDishLeftData(responseData);
    } catch (err) {}
  };

  const fetchDishWeekDays = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:8000/api/statistics/dishes/dish-week-days-stats/${dishId}`,
        "POST",
        JSON.stringify({ period: periodWeekDays }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );

      setDishesWeekDays(responseData);
    } catch (err) {}
  };

  const fetchDishTotal = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:8000/api/statistics/dishes/dish-total/${dishId}`,
        "POST",
        JSON.stringify({ period: periodTotal }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      console.log(responseData)
      setDishTotal(responseData);
    } catch (err) {}
  };

  useEffect(() => {
    fetchDishTotal();
    fetchDishData();
    fetchDishLeftData();
  }, []);

  useEffect(() => {
    fetchDishTotal();
  }, [periodTotal]);

  useEffect(() => {
    fetchDishWeekDays();
  }, [periodWeekDays]);

  useEffect(() => {
    fetchDishData();
  }, [periodProfit]);

  const labels = dishData
    ? dishData.revenueByPeriod.map((item) => item.period)
    : [];
  const revenueData = dishData
    ? dishData.revenueByPeriod.map((item) => parseFloat(item.revenue))
    : [];

  const weekDaysLabels = dishesWeekDays
    ? dishesWeekDays.popularity.map((item) => item.day)
    : [];
  const weekDaysCounts = dishesWeekDays
    ? dishesWeekDays.popularity.map((item) => item.count)
    : [];

  console.log(revenueData)

  let pieChartData;

  if (dishData) {
    // Tworzenie danych do wykresu
    pieChartData = [
      // Dodajemy składniki z procentowym udziałem w cenie dania
      ...dishData.ingredients.map((ingredient) => ({
        label: ingredient.name, // Nazwa składnika
        value: parseFloat(ingredient.percentageOfDishPrice), // Procentowy udział w cenie dania
      })),
      // Dodajemy marżę zysku jako oddzielny element
      {
        label: "Marża zysku",
        value: parseFloat(dishData.profitMargin.percentage), // Procentowy udział marży zysku
      },
    ];

    // Wyświetlanie w konsoli w celu debugowania
    console.log("Pie Chart Data:", pieChartData);
  }

  const handleWeightChange = (ingredient, value) => {
    setCustomWeights((prevWeights) => ({
      ...prevWeights,
      [ingredient]: value,
    }));
  };

  const handlePeriodweekDays = (newPeriod) => {
    setPeriodWeekDays(newPeriod);
  };

  const handlePeriodTotalChange = (newPeriod) => {
    setPeriodTotal(newPeriod);
  };

  const handlePeriodProfitChange = (newPeriod) => {
    setPeriodProfit(newPeriod);
  };



  return (
    <div>
      <div className="container-statistics">
        <Navbar />
        <div className="statistics">
          <div className="dish-info2">
            <h1>Informacje o daniu</h1>
            {dishData && dishLeftData && (
              <div className="dish-info-content2">
                <h2>{dishData.dish.name}</h2>
                <h2>
                  <strong>Cena dania: </strong>
                  {dishData.dish.price} PLN
                </h2>
                <h3>Składniki:</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {dishData.ingredients.map((ingredient, index) => (
                    <li key={index} className="dish-stats-container">
                      <div className="dish-stats-item-name">
                        <strong>{ingredient.name}</strong> 
                      </div>
                      <div className="dish-stats-item-count">- Koszt:{" "}{ingredient.totalCost} PLN,  </div>
                      <div className="dish-stats-item-price">
                      -Ilość (g): {ingredient.totalWeight},
                      </div>
                      <div className="dish-stats-item-percentage">Procent ceny dania:{" "}{ingredient.percentageOfDishPrice}%</div>
                    </li>
                  ))}
                </ul>

                <h3>Informacje ogólne</h3>
                <p>
                  <strong>Marża zysku: </strong>
                  {dishData.profitMargin.value}
                  <br />
                  <strong>Procent marży zysku: </strong>
                  {dishData.profitMargin.percentage} %
                </p>
                <p>
                  <strong>Łączny przychód w ostatnim tygodniu: </strong>
                  {dishData.totalRevenue} PLN
                </p>
                <p>
                  <strong>Łączna liczba zamówień w ostatnim tygodniu: </strong>
                  {dishData.totalQuantity}
                </p>
                <p>
                  <strong>
                    Maksymalna liczba dań możliwych do przygotowania:{" "}
                  </strong>
                  {dishLeftData.maxDishesPossible}
                </p>
              </div>
            )}
          </div>
          <div className="grid-container-statistics">
            <div className="ranking">
              <>
                <h2>Przychód za danie na przestrzeni czasu</h2>
                <div className="pie-chart-statistics-placeholder">
                  <LineChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: labels,

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
                        data: revenueData,
                        color: initialColor,
                        area: true,
                      }, // Kolor i dane dla kolumn
                    ]}
                    colors={{ scheme: "nivo" }}
                    width={600}
                    height={300}
                  />
                </div>
                <div className="date-pickers">
                  <button
                    className={`picker-btn ${
                      periodProfit === "rok" ? "active-period-button" : ""
                    }`}
                    onClick={() => handlePeriodProfitChange("rok")}
                  >
                    rok
                  </button>
                  <button
                    className={`picker-btn ${
                      periodProfit === "miesiac" ? "active-period-button" : ""
                    }`}
                    onClick={() => handlePeriodProfitChange("miesiac")}
                  >
                    miesiąc
                  </button>
                  <button
                    className={`picker-btn ${
                      periodProfit === "tydzien" ? "active-period-button" : ""
                    }`}
                    onClick={() => handlePeriodProfitChange("tydzien")}
                  >
                    tydzień
                  </button>
                </div>
              </>
            </div>
            <div className="ranking">
              <h2>Ilość wystąpień dania na przestrzeni dni tygodnia</h2>
              <div className="pie-chart-statistics">
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: weekDaysLabels,

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
                      data: weekDaysCounts,
                      color: initialColor,
                    },
                  ]}
                  colors={{ scheme: "nivo" }}
                  width={600}
                  height={300}
                />
              </div>
              <div className="date-pickers">
                <button
                  className={`picker-btn ${
                    periodWeekDays === "rok" ? "active-period-button" : ""
                  }`}
                  onClick={() => handlePeriodweekDays("rok")}
                >
                  rok
                </button>
                <button
                  className={`picker-btn ${
                    periodWeekDays === "miesiac" ? "active-period-button" : ""
                  }`}
                  onClick={() => handlePeriodweekDays("miesiac")}
                >
                  miesiąc
                </button>
                <button
                  className={`picker-btn ${
                    periodWeekDays === "tydzien" ? "active-period-button" : ""
                  }`}
                  onClick={() => handlePeriodweekDays("tydzien")}
                >
                  tydzień
                </button>
              </div>
            </div>
            <div className="ranking">
              <div className="pie-chart-statistics">
                {pieChartData && pieChartData.length > 0 ? (
                  <PieChart
                    colors={result}
                    series={[
                      {
                        data: pieChartData,
                        arcLabel: (item) => `${item.value}%`, // Etykieta sektora
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
                ) : (
                  <p>Ładowanie danych lub brak danych do wyświetlenia.</p>
                )}
              </div>
            </div>

            <div className="ranking">
              {dishTotal.length !== 0 && (
                <>
                  <h2 style={{textAlign: "center"}}>Wykres ilosci wystąpień dania w zamowieniach na przestrzeni czasu</h2>
                  <div className="pie-chart-statistics">
                    <LineChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: dishTotal.labels, // 7 dni tygodnia

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
                          data: dishTotal.data,
                          color: "rgb(117, 148, 215)",
                          area: true,
                        },
                      ]}
                      colors={{ scheme: "nivo" }}
                      height={300}
                    />
                  </div>
                  <div className="date-pickers">
                    <button
                      className={`picker-btn ${
                        periodTotal === "rok" ? "active-period-button" : ""
                      }`}
                      onClick={() => handlePeriodTotalChange("rok")}
                    >
                      rok
                    </button>
                    <button
                      className={`picker-btn ${
                        periodTotal === "miesiac" ? "active-period-button" : ""
                      }`}
                      onClick={() => handlePeriodTotalChange("miesiac")}
                    >
                      miesiąc
                    </button>
                    <button
                      className={`picker-btn ${
                        periodTotal === "tydzien" ? "active-period-button" : ""
                      }`}
                      onClick={() => handlePeriodTotalChange("tydzien")}
                    >
                      tydzień
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dish;
