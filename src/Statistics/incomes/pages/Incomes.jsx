import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import Navbar from "../../components/Navbar";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { LineChart } from "@mui/x-charts/LineChart";
import "./Incomes.css";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { URL } from "../../../shared/consts";

const initialColor = "rgb(117, 148, 215)";

const Incomes = () => {
  const [dishes, setDishes] = useState(null);
  const [dishesRanking, setDishesRanking] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState("wszystkie");
  const [inputName, setInputName] = useState("");
  const [categories, setCategories] = useState([]);
  const [years, setYears] = useState(2);
  const [inputYears, setInputYears] = useState(2);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await sendRequest(
          `${URL}/api/config/dish-categories`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(response.categories);
        setCategories(response.categories);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [sendRequest]);

  const fetchData = async () => {
    try {
      const responseData = await sendRequest(
        `${URL}/api/statistics/dishes/dish-revenue-prediction/?years=${years}`,
        "POST",
        null,
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );

      const responseData2 = await sendRequest(
        `${URL}/api/statistics/dishes/dishes-count`,
        "POST",
        null,
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );

      console.log(responseData);
      console.log(responseData2);

      setDishes(responseData.results);
      setDishesRanking(responseData.ranking);
      setTotalProfit(responseData.globalTotalProfit);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sendRequest, inputName, selectedCategory, years]);

  const categoryChangeHandler = (event) => {
    setSelectedCategory(event.target.value);
  };

  const nameChangeHandler = (event) => {
    setInputName(event.target.value);
  };

  const handleYearsChange = (event) => {
    setInputYears(event.target.value); // Aktualizuje wartość input, ale nie wysyła zapytania
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setYears(inputYears); // Aktualizuje stan lat i uruchamia zapytanie
    }
  };


  if (error) {
    return <div>Błąd: {error}</div>;
  }

  const getMonthNames = (numMonths) => {
    const monthNames = [
      "Styczeń",
      "Luty",
      "Marzec",
      "Kwiecień",
      "Maj",
      "Czerwiec",
      "Lipiec",
      "Sierpień",
      "Wrzesień",
      "Październik",
      "Listopad",
      "Grudzień",
    ];

    const months = [];
    const currentMonthIndex = new Date().getMonth();
    for (let i = 0; i < numMonths; i++) {
      const monthIndex = (currentMonthIndex + i) % 12;
      months.push(monthNames[monthIndex]);
    }
    return months;
  };

  return (
    <div className="container-statistics">
      <Navbar />
      <div className="content">
        { isLoading && (

          <div className="spinner">
            <LoadingSpinner/>
          </div>
          )
        }
        {totalProfit && (
          <>
            <h1 className="text5">
              Prognozowany przychód całkowity na {years}
              {years == 1 ? " rok" : " lata"}
            </h1>
            <div className="ranking3">
              <div className="gauge-item">
                <div className="gauge-item2">
                  <Gauge
                    sx={(theme) => ({
                      [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 24,
                      },
                      [`& .${gaugeClasses.valueArc}`]: {
                        fill: "rgb(117, 148, 215)",
                      },
                      [`& .${gaugeClasses.referenceArc}`]: {
                        fill: theme.palette.text.disabled,
                      },
                    })}
                    value={totalProfit.toFixed(2)}
                    startAngle={0}
                    endAngle={360}
                    innerRadius="80%"
                    outerRadius="100%"
                  />
                </div>
                <span>Przychód</span>
              </div>
            </div>
          </>
        )}

        {totalProfit && (
          <div className="year-input">
            <div className="year-input-content">
              <label htmlFor="years">Liczba lat:</label>
              <div className="year-input-input">
                <input
                  id="years"
                  type="number"
                  min="1"
                  value={inputYears}
                  onChange={handleYearsChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </div>
        )}

        {dishesRanking && !isLoading && (
          <>
            <h1 className="text5">Ranking dań</h1>
            <div className="list-form-placeholder-ingredient-incomes">
              <div className="ingredients-list-desc">
                <span className="item-name-ingredient">lp.</span>
                <span className="dish-update-name-incomes">nazwa</span>
                <span className="item-category">przychód całkowity</span>
              </div>
            </div>

            <ul className="dish-update-list-form-incomes">
              {dishesRanking.map((dish, index) => (
                <li
                  key={dish._id}
                  className={
                    index === dishes.length - 1
                      ? "last-ingredient2"
                      : "cart-item-ingredient-incomes"
                  }
                >
                  <span className="dish-update-name">{index + 1}</span>
                  <span className="dish-update-name-incomes">
                    {dish.dishName}
                  </span>
                  <span className="dish-update-category">
                    {dish.totalProfit.toFixed(2)} PLN
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
     
        {dishes && <h1 className="text5">Statystyki poszczególnych dań</h1>}
        {dishes &&
          !isLoading &&
          dishes.map((dish, index) => (
            <>
              <div key={index} className="dish-info2">
                <div className="dish-info-content-incomes">
                  <h1>{dish.dishName}</h1>
                  <p>Cena Dania: {dish.dishPrice} zł</p>
                  <p>Marża: {dish.profitMargin.toFixed(2)}%</p>
                  <p>Wartość Marży: {dish.marginValue.toFixed(2)} zł</p>
                  <p>
                    Łączny Przychód: {dish.totalProjectedRevenue.toFixed(2)} zł
                  </p>

                  <h2>Szczegóły Składników</h2>

                  <div className="place-list-form-placeholder-ingredient">
                    <div className="cook-list-desc">
                      <div className="cook-name">Nazwa Składnika</div>
                      <span className="cook-name">Waga (g)</span>
                      <span className="cook-surname">Średnia Cena za 1g</span>
                      <span className="cook-pesel">Koszt Składnika (zł)</span>
                      <span className="cook-action">Udział w Cenie (%)</span>
                    </div>
                  </div>

                  <ul className="list-form-cooks">
                    {dish.ingredientDetails.map((ingredient, i) => (
                      <li
                        key={ingredient.id}
                        className={
                          index === ingredient.length - 1
                            ? "last-ingredient"
                            : "cook-list-item"
                        }
                      >
                        <span className="cook-name">{ingredient.name}</span>
                        <span className="cook-surname">
                          {ingredient.weightInDish}
                        </span>
                        <span className="cook-pesel">
                          {ingredient.averagePriceRatio.toFixed(2)}
                        </span>
                        <span className="cook-pesel">
                          {ingredient.finalCost.toFixed(2)}
                        </span>
                        <span className="cook-pesel">
                          {ingredient.contributionPercentage.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <h2>Prognozowane Zamówienia i Przychody</h2>
                  <div className="place-list-form-placeholder-ingredient">
                    <div className="cook-list-desc">
                      <span className="cook-name">Okres</span>
                      <span className="cook-surname">
                        Prognozowane Zamówienia
                      </span>
                      <span className="cook-pesel">
                        Prognozowany Przychód (zł)
                      </span>
                    </div>
                  </div>
                  <ul className="list-form-cooks">
                    {dish.projectedOrders.map((orders, i) => (
                      <li
                        key={orders.id}
                        className={
                          index === orders.length - 1
                            ? "last-ingredient"
                            : "cook-list-item"
                        }
                      >
                        <span className="cook-surname">
                          {getMonthNames(dish.projectedOrders.length)[i]}
                        </span>
                        <span className="cook-pesel">{orders.toFixed(2)}</span>
                        <span className="cook-pesel">
                          {dish.projectedRevenues[i].toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <h3>Prognoza Przychodów (Wykres)</h3>
                  <div className="center">
                    {dishes && (
                      <LineChart
                        xAxis={[
                          {
                            scaleType: "band",
                            data: getMonthNames(dish.projectedOrders.length), // Month names
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
                            data: dish.projectedRevenues,
                            color: initialColor,
                            area: true,
                          },
                        ]}
                        colors={{ scheme: "nivo" }}
                        width={600}
                        height={300}
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          ))}
      </div>
    </div>
  );
};

export default Incomes;
