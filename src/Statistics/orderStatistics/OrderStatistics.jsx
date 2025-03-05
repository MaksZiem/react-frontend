import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./OrderStatistics.css";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { darkenColor } from "../../shared/helpers/darkenColor";
import { useNavigate } from "react-router-dom";
import { URL } from "../../shared/consts";

const Statistics = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [percentageDish, setPercentageDish] = useState([]);
  const [totalWeekProfit, setTotalWeekProfit] = useState();
  const [periodTotal, setPeriodTotal] = useState("tydzien");
  const [periodDayOfWeek, setPeriodDayOfWeek] = useState("tydzien");
  const [periodPercentage, setPeriodPercentage] = useState("tydzien");
  const [ordersLastWeek, setOrdersLastWeek] = useState([]);
  const [ordersByDayOfWeek, setOrdersByDayOfWeek] = useState([]);
  const auth = useContext(AuthContext);
  const initialColor = "rgb(117, 148, 215)";
  const [incomeColor, setIncomeColor] = useState("rgb(117, 148, 215)");

  const steps = 10;
  const result = darkenColor(initialColor, steps);
  const navigate = useNavigate();

  const fetchStatistics = async () => {
    try {
      const responseDataStats = await sendRequest(
        `${URL}/api/statistics/orders/percentage-stats`,
        "POST",
        JSON.stringify({ periodPercentage }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      const transformedData = Object.entries(
        responseDataStats.dishPercentage
      ).map(([label, value], index) => ({
        id: index,
        value,
        label,
      }));

      setPercentageDish(transformedData);
      console.log(responseDataStats.dishPercentage);

      const fetchTotalWeekProfit = await sendRequest(
        `${URL}/api/statistics/orders/total-profit`,
        "POST",
        JSON.stringify({ periodPercentage }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );

      if(fetchTotalWeekProfit.totalProfit) {
        setIncomeColor("rgb(235, 64, 52)")
      }

      setTotalWeekProfit(fetchTotalWeekProfit.totalProfit);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOrdersTotal = async () => {
    try {
      const responseData = await sendRequest(
        `${URL}/api/statistics/orders/last-week-stats`,
        "POST",
        JSON.stringify({ periodTotal }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      setOrdersLastWeek(responseData);
      console.log(responseData)
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrdersByDayOfWeek = async () => {
    try {
      const responseData = await sendRequest(
        `${URL}/api/statistics/orders/by-day-of-week`,
        "POST",
        JSON.stringify({ period: periodDayOfWeek }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );

      const labels = responseData.map((item) => item.day);
      const data = responseData.map((item) => item.count);

      setOrdersByDayOfWeek({ labels, data });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [periodPercentage]);

  useEffect(() => {
    fetchOrdersTotal();
  }, [periodTotal]);

  useEffect(() => {
    fetchOrdersByDayOfWeek();
  }, [periodDayOfWeek]);

  const handlePeriodPercentageChange = (newPeriod) => {
    setPeriodPercentage(newPeriod);
  };

  const handlePeriodDayOfWeekChange = (newPeriod) => {
    setPeriodDayOfWeek(newPeriod);
  };

  const handlePeriodTotalChange = (newPeriod) => {
    setPeriodTotal(newPeriod);
  };

  const navigateToOrdersHistory = () => {
    navigate("/statistics/orders/details");
  };

  return (
    <div>
      <div className="container-statistics">
        <Navbar />
        <div className="grid-container2">
          <div className="ranking">
            {percentageDish && (
              <>
                <h2 style={{textAlign: "center"}}>Wykres procentowych udziałów dań w zamówieniach</h2>
                <div className="pie-chart-statistics">
                  <PieChart
                    colors={result}
                    series={[
                      {
                        data: percentageDish,
                        arcLabel: (item) => `${item.value}%`,
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
                <div className="date-pickers">
                  <button
                    className={`picker-btn ${
                      periodPercentage === "rok" ? "active-period-button" : ""
                    }`}
                    onClick={() => handlePeriodPercentageChange("rok")}
                  >
                    rok
                  </button>
                  <button
                    className={`picker-btn ${
                      periodPercentage === "miesiac"
                        ? "active-period-button"
                        : ""
                    }`}
                    onClick={() => handlePeriodPercentageChange("miesiac")}
                  >
                    miesiąc
                  </button>
                  <button
                    className={`picker-btn ${
                      periodPercentage === "tydzien"
                        ? "active-period-button"
                        : ""
                    }`}
                    onClick={() => handlePeriodPercentageChange("tydzien")}
                  >
                    tydzień
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="ranking">
              <>
                <h2>Ogólne statystyki</h2>
                <div className="ranking2">
                  <div className="gauge-item">
                    <div className="gauge-item2">
                      {totalWeekProfit && incomeColor && (
                      <Gauge
                        sx={(theme) => ({
                          [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 40,
                          },
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: incomeColor,
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
                    )}
                    </div>
                    <span>Przychód</span>
                  </div>
                  <div className="gauge-item">
                    <div className="gauge-item2">
                      {ordersLastWeek.length !== 0 && (
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
                      />
                    )}
                    </div>
                    <span>Ilość zamówień</span>
                  </div>
                </div>
              </>            
          </div>
          <div className="ranking">
            {ordersByDayOfWeek.length !== 0 && (
              <>
                <h2>Zamówienia na przestrzeni dni tygodnia</h2>
                <div className="pie-chart-statistics-placeholder">
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: ordersByDayOfWeek.labels,
                        legend: { text: { fill: "white" } },
                        ticks: {
                          line: { stroke: "white", strokeWidth: 1 },
                          text: { fill: "white" },
                        },
                      },
                    ]}
                    series={[
                      {
                        data: ordersByDayOfWeek.data, // Liczba zamówień na każdy dzień
                        color: "rgb(117, 148, 215)",
                      },
                    ]}
                    height={300}
                  />
                </div>
              </>
            )}
            <div className="date-pickers">
              <button
                className={`picker-btn ${
                  periodDayOfWeek === "rok" ? "active-period-button" : ""
                }`}
                onClick={() => handlePeriodDayOfWeekChange("rok")}
              >
                rok
              </button>
              <button
                className={`picker-btn ${
                  periodDayOfWeek === "miesiac" ? "active-period-button" : ""
                }`}
                onClick={() => handlePeriodDayOfWeekChange("miesiac")}
              >
                miesiąc
              </button>
              <button
                className={`picker-btn ${
                  periodDayOfWeek === "tydzien" ? "active-period-button" : ""
                }`}
                onClick={() => handlePeriodDayOfWeekChange("tydzien")}
              >
                tydzień
              </button>
            </div>
          </div>
          <div className="ranking">
            {ordersLastWeek.length !== 0 && (
              <>
                <h2>Wykres ilosci zamowien na przestrzeni czasu</h2>
                <div className="pie-chart-statistics">
                  <LineChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: ordersLastWeek.labels, // 7 dni tygodnia

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
      <div className="text2">
        <button
          onClick={navigateToOrdersHistory}
          className="cook-orders-button"
        >
          Przejdź do historii zamówień
        </button>
      </div>
    </div>
  );
};

export default Statistics;
