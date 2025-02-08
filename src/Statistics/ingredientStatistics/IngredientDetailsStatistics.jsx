import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { darkenColor } from "../../shared/helpers/darkenColor";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import Navbar from "../components/Navbar";
import "./IngredientDetailsStatistics.css";

const IngredientStats = () => {
  const location = useLocation();
  const { ingredientName } = location.state || {};
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [ingredientStats, setIngredientStats] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [ingredientUsage, setIngredientUsage] = useState(null);
  const [periodUsage, setPeriodUsage] = useState("tydzien");
  const [periodWaste, setPeriodWaste] = useState("tydzien");
  const [ingredientWaste, setIngredientWaste] = useState(null);
  const auth = useContext(AuthContext);
  const [ingredients, setIngredients] = useState([]);
  const initialColor = "rgb(117, 148, 215)";
  const initialColorWaste = "rgb(227, 36, 36)";
  const steps = 10;
  const result = darkenColor(initialColor, steps);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchIngredientUsage = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/statistics/ingredients/usage/${ingredientName}`,
          "POST",
          JSON.stringify({ period: periodUsage }),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );
        setIngredientUsage(responseData);
        console.log(responseData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchIngredientUsage();
  }, [periodUsage]);

  useEffect(() => {
    const fetchIngredientWaste = async () => {
      try {
        const responseDataWaste = await sendRequest(
          `http://localhost:8000/api/statistics/ingredients/waste/${ingredientName}`,
          "POST",
          JSON.stringify({ period: periodWaste }),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );
        setIngredientWaste(responseDataWaste);
      } catch (error) {
        console.error(error);
      }
    };

    fetchIngredientWaste();
  }, [periodWaste]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/magazine/${ingredientName}`
        );
        setIngredients(responseData.ingredients);
      } catch (err) {}
    };
    fetchIngredients();
  }, [sendRequest, ingredientName]);

  useEffect(() => {
    const fetchIngredientStats = async () => {
      if (!ingredientName) return;

      try {
        const responseStats = await sendRequest(
          `http://localhost:8000/api/statistics/ingredients/waste-propability/${ingredientName}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );

        setIngredientStats(responseStats);

        const responseUsage = await sendRequest(
          `http://localhost:8000/api/statistics/ingredients/ingredient-in-dishes/${ingredientName}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );

        const ingredientUsage = responseUsage.ingredientUsage;
        const totalQuantity = Object.values(ingredientUsage).reduce(
          (sum, item) => sum + item.totalQuantity,
          0
        );

        const formattedData = Object.values(ingredientUsage).map((item) => ({
          id: item.dishName,
          label: item.dishName,
          value: ((item.totalQuantity / totalQuantity) * 100).toFixed(2),
        }));

        setPieChartData(formattedData);
      } catch (err) {
        console.error(err);
        setFetchError("Nie znaleziono zamówień dla tego składnika.");
      }
    };

    fetchIngredientStats();
  }, [sendRequest, ingredientName, auth.token]);

  const labelsUsage = ingredientUsage
    ? ingredientUsage.usageByPeriod.map((item) => item.period)
    : [];
  const revenueDataUsage = ingredientUsage
    ? ingredientUsage.usageByPeriod.map((item) => parseFloat(item.usage))
    : [];

  const labelsWaste = ingredientWaste
    ? ingredientWaste.usageByPeriod.map((item) => item.period)
    : [];
  const revenueDataWaste = ingredientWaste
    ? ingredientWaste.usageByPeriod.map((item) => parseFloat(item.usage))
    : [];

  const handlePeriodUsage = (newPeriod) => {
    if (newPeriod !== periodUsage) {
      setPeriodUsage(newPeriod);
    }
  };

  const handlePeriodWaste = (newPeriod) => {
    if (newPeriod !== periodWaste) {
      setPeriodWaste(newPeriod);
    }
  };

  {
    !ingredientStats && !ingredientUsage && (
      <h1 className="text3">Brak gotowych dań do odebrania</h1>
    );
  }

  return (
    <>
      <div className="container-statistics">
        <Navbar />
        <div className="statistics">
          {fetchError && <h1 className="text3"> {fetchError}</h1>}
          {!isLoading && ingredientStats && ingredientUsage && (
            <div className="grid-container-statistics">
              <div className="ranking">
                <>
                  <h2>Uycie skladnika na przestrzeni czasu</h2>
                  <div className="pie-chart-statistics-placeholder">
                    <LineChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: labelsUsage,

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
                          data: revenueDataUsage,
                          color: initialColor,
                          area: true,
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
                        periodUsage === "rok" ? "active-period-button" : ""
                      }`}
                      onClick={() => handlePeriodUsage("rok")}
                    >
                      rok
                    </button>
                    <button
                      className={`picker-btn ${
                        periodUsage === "miesiac" ? "active-period-button" : ""
                      }`}
                      onClick={() => handlePeriodUsage("miesiac")}
                    >
                      miesiąc
                    </button>
                    <button
                      className={`picker-btn ${
                        periodUsage === "tydzien" ? "active-period-button" : ""
                      }`}
                      onClick={() => handlePeriodUsage("tydzien")}
                    >
                      tydzień
                    </button>
                  </div>
                </>
              </div>
              <div className="ranking">
                <>
                  <h2>Użycie składnika w daniach</h2>
                  <div className="pie-chart-statistics-placeholder">
                    <PieChart
                      colors={result}
                      series={[
                        {
                          data: pieChartData,
                          arcLabel: (item) => `${item.label}: ${item.value}%`,
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
                </>
              </div>
              <div className="ranking">
                <>
                  <h2>Straty na przestrzeni czasu</h2>
                  <div className="pie-chart-statistics-placeholder">
                    <LineChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: labelsWaste,

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
                          data: revenueDataWaste,
                          color: initialColorWaste,
                          area: true,
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
                        periodWaste === "rok" ? "active-period-button" : ""
                      }`}
                      onClick={() => handlePeriodWaste("rok")}
                    >
                      rok
                    </button>
                    <button
                      className={`picker-btn ${
                        periodWaste === "miesiac" ? "active-period-button" : ""
                      }`}
                      onClick={() => handlePeriodWaste("miesiac")}
                    >
                      miesiąc
                    </button>
                    <button
                      className={`picker-btn ${
                        periodWaste === "tydzien" ? "active-period-button" : ""
                      }`}
                      onClick={() => handlePeriodWaste("tydzien")}
                    >
                      tydzień
                    </button>
                  </div>
                </>
              </div>
              <div className="ranking">
                {ingredientWaste && (
                  <>
                    <h2>Ogólne statystyki strat</h2>
                    <div className="ranking2">
                      <div className="gauge-item">
                        <div className="gauge-item2">
                          <Gauge
                            sx={(theme) => ({
                              [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 26,
                              },
                              [`& .${gaugeClasses.valueArc}`]: {
                                fill: initialColorWaste,
                              },
                              [`& .${gaugeClasses.referenceArc}`]: {
                                fill: theme.palette.text.disabled,
                              },
                            })}
                            value={ingredientWaste.totalWeightLoss}
                            startAngle={0}
                            endAngle={360}
                            innerRadius="80%"
                            outerRadius="100%"
                          />
                        </div>
                        <span>Strata w ilości (g)</span>
                      </div>
                      <div className="gauge-item">
                        <div className="gauge-item2">
                          <Gauge
                            sx={(theme) => ({
                              [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 26,
                              },
                              [`& .${gaugeClasses.valueArc}`]: {
                                fill: initialColorWaste,
                              },
                              [`& .${gaugeClasses.referenceArc}`]: {
                                fill: theme.palette.text.disabled,
                              },
                            })}
                            value={ingredientWaste.totalValueLoss}
                            startAngle={0}
                            endAngle={360}
                            innerRadius="80%"
                            outerRadius="100%"
                          />
                        </div>
                        <span>Strata w sumie (PLN)</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {!isLoading && ingredientStats && ingredients.length > 0 && (
            <div className="ingredient-info">              
              <div className="ingredient-info-content-left">
                <div className="ingredient-info-content-header">
                  <h2 className="text">
                    Statystyki dla składnika: {ingredientName}
                  </h2>
                </div>
                <div className="ingredient-info-content">
                  <p>
                    <strong>Średnie dzienne zużycie (ostatnie 30 dni): </strong>
                    {ingredientStats.averageDailyUsage}
                  </p>
                  <p>
                    <strong>Dni do wyczerpania skladnika: </strong>{" "}
                    {ingredientStats.daysUntilOutOfStock}
                  </p>
                  <p>
                    <strong>Dni do końca daty waznosci: </strong>{" "}
                    {ingredientStats.daysUntilExpiration}
                  </p>
                  <p>
                    <strong>Prawdopodobieństwo niedoboru: </strong>
                    {ingredientStats.shortageProbability}%
                  </p>
                  <p>
                    <strong>Łączna waga składnika: </strong>
                    {ingredientStats.totalWeightOfIngredient}
                  </p>
                </div>
              </div>
              <div className="ingredient-info-content-right">
                <div className="ingredient-info-content-header">
                  <h2 className="text">Wybrane składniki</h2>
                </div>
                <div className="place-list-form-placeholder-ingredient">
                  <div className="ingredients-list-desc">
                    <span className="item-name-ingredient">Nazwa</span>
                    <span className="item-category">Kategoria</span>
                    <span className="item-weight">Ilość</span>
                    <span className="item-action">Data ważności</span>
                  </div>
                </div>
                <ul className="place-list-form-ingredient">
                  {ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
                      <div className="cart-item-ingredient">
                        <span className="item-category">{ingredient.name}</span>
                        <span className="item-category">
                          {ingredient.category}
                        </span>
                        <span className="item-weight">{ingredient.weight}</span>
                        <span className="item-category">
                          {ingredient.expirationDate}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default IngredientStats;
