import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { URL } from "../../shared/consts";
import { LineChart } from "@mui/x-charts/LineChart";
import "./EmpCookStats.css";

const EmpCookStats = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState();
  const [dishes, setDishes] = useState([]);
  const location = useLocation();
  const auth = useContext(AuthContext);
  let { cookId } = location.state || {};
  const navigate = useNavigate();
  const [periodDishCount, setPeriodDishCount] = useState("tydzien");
  const [periodPreparationTime, setPeriodPreparationTime] = useState("tydzien");
  const [dishCount, setDishCount] = useState();
  const [preparationTime, setPreparationTime] = useState();

  const fetchDishes = async () => {
    try {
      const responseDishes = await sendRequest(
        `${URL}/api/dishes/`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      setDishes(responseDishes.dishes);
    } catch (err) {}
  };

  const fetchDishCount = async () => {
    if (!cookId) {
      cookId = auth.userId;
      console.log(cookId);
    }
    try {
      const cookStats = await sendRequest(
        `${URL}/api/cook/dishes-count/${cookId}`,
        "POST",
        JSON.stringify({ period: periodDishCount }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      setDishCount(cookStats);
      console.log('cook stats: ', cookStats)
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPreparationTime = async () => {
    if (!cookId) {
      cookId = auth.userId;
      // console.log(cookId);
    }
    try {
      const cookStats = await sendRequest(
        `${URL}/api/cook/preparation-time/${cookId}`,
        "POST",
        JSON.stringify({ period: periodPreparationTime }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      console.log('preparationTime: ',cookStats);
      setPreparationTime(cookStats);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserData = async () => {
    if (!cookId) {
      cookId = auth.userId;
      // console.log(cookId);
    }
    try {
      const userData = await sendRequest(
        `${URL}/api/users/${cookId}`,
        "POST",
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      )
      setUserData(userData.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchDishes();
  }, []);

  useEffect(() => {
    fetchDishCount();
  }, [periodDishCount]);

  useEffect(() => {
    fetchPreparationTime();
  }, [periodPreparationTime]);

  const handleCookClick = (dishId, dishName) => {
    navigate(`/dish/stats`, {
      state: { cookId: cookId, dishId: dishId, dishName: dishName },
    });
  };

  const handlePeriodDishCountChange = (newPeriod) => {
    setPeriodDishCount(newPeriod);
  };

  const handlePeriodPreparationTimeChange = (newPeriod) => {
    setPeriodPreparationTime(newPeriod);
  };

  const navigateToOrdersHistory = () => {
    navigate("/statistics/cook/orders", {
      state: { cookId: cookId },
    });
  };

  console.log(auth);

  return (
    <>
      <div className="container-statistics-cook">
        <Navbar />
        <div className="statistics">
          <div className="dish-info">
            {userData ? (
              <>
                <h1>
                  Statystyki kucharza: {userData.name} {userData.surname}
                </h1>
              </>
            ) : (
              <p>error</p>
            )}
          </div>

          <div className="dish-info">
            <div className="grid-container-cook">
              <div className="ranking">
                {dishCount && (
                  <>
                    <h2>Zamówienia na przestrzeni dni tygodnia</h2>
                    <div className="pie-chart-statistics-placeholder">
                      <LineChart
                        xAxis={[
                          {
                            scaleType: "band",
                            data: dishCount.labels,
                            legend: { text: { fill: "white" } },
                            ticks: {
                              line: { stroke: "white", strokeWidth: 1 },
                              text: { fill: "white" },
                            },
                          },
                        ]}
                        series={[
                          {
                            data: dishCount.dishesCount,
                            color: "rgb(117, 148, 215)",
                            area: true,
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
                      periodDishCount === "rok" ? "active-period-button" : ""
                    }`}
                    onClick={() => handlePeriodDishCountChange("rok")}
                  >
                    rok
                  </button>
                  <button
                    className={`picker-btn ${
                      periodDishCount === "miesiac"
                        ? "active-period-button"
                        : ""
                    }`}
                    onClick={() => handlePeriodDishCountChange("miesiac")}
                  >
                    miesiąc
                  </button>
                  <button
                    className={`picker-btn ${
                      periodDishCount === "tydzien"
                        ? "active-period-button"
                        : ""
                    }`}
                    onClick={() => handlePeriodDishCountChange("tydzien")}
                  >
                    tydzień
                  </button>
                </div>
              </div>
              <div className="ranking">
                {preparationTime && (
                  <>
                    <h2>Wykres średniego czasu na przygotowanie dania</h2>
                    <div className="pie-chart-statistics">
                      <LineChart
                        xAxis={[
                          {
                            scaleType: "band",
                            data: preparationTime.labels, // 7 dni tygodnia

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
                            data: preparationTime.preparationTime,
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
                          periodPreparationTime === "rok"
                            ? "active-period-button"
                            : ""
                        }`}
                        onClick={() => handlePeriodPreparationTimeChange("rok")}
                      >
                        rok
                      </button>
                      <button
                        className={`picker-btn ${
                          periodPreparationTime === "miesiac"
                            ? "active-period-button"
                            : ""
                        }`}
                        onClick={() =>
                          handlePeriodPreparationTimeChange("miesiac")
                        }
                      >
                        miesiąc
                      </button>
                      <button
                        className={`picker-btn ${
                          periodPreparationTime === "tydzien"
                            ? "active-period-button"
                            : ""
                        }`}
                        onClick={() =>
                          handlePeriodPreparationTimeChange("tydzien")
                        }
                      >
                        tydzień
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            {orders && (
              <>
                <div>
                  <h3 className="text2">Dania:</h3>
                  <div className="place-list-form-placeholder-ingredient">
                    <div className="ingredients-list-desc">
                      <span className="item-name-ingredient">nazwa</span>
                      <span className="item-category">cena</span>
                      <span className="item-category">dostepnosc</span>
                      <span className="item-action">akcje</span>
                    </div>
                  </div>
                  <ul className="place-list-form-ingredient">
                    {dishes.map((dish, index) => (
                      <li
                        key={dish._id}
                        className={
                          index === dishes.length - 1
                            ? "last-dish"
                            : "cart-item-dish"
                        }
                      >
                        <span className="item-name-ingredient">
                          {dish.name}
                        </span>
                        <span className="item-category">{dish.price} PLN</span>
                        <span className="item-category">
                          {dish.isAvailable ? "Dostępne" : "Niedostępne"}
                        </span>
                        <div className="item-action">
                          <button
                            className="ingredient-details-button4"
                            onClick={() => {
                              handleCookClick(dish._id, dish.name);
                            }}
                          >
                            Statystyki dania
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
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
    </>
  );
};

export default EmpCookStats;
