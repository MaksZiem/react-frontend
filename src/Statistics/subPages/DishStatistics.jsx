import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { URL } from "../../shared/consts";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./DishStatistics.css";

const DishStatistics = () => {
  const location = useLocation();
  const { cookId, dishId, dishName } = location.state || {};
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dishes, setDishes] = useState([]);
  const auth = useContext(AuthContext);
  const [userData, setUserData] = useState();

  const fetchDishStats2 = async () => {
    try {
      const responseData = await sendRequest(
        `${URL}/api/cook/dishes/${cookId}`,
        "POST",
        JSON.stringify({
          dishId,
          startDate,
          endDate,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      setDishes(responseData.dishes);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserData = async () => {
    if (!cookId) {
      cookId = auth.userId;
    }
    try {
      const userData = await sendRequest(
        `${URL}/api/users/${cookId}`,
        "POST",
        null,
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      setUserData(userData.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchDishStats2();
  }, []);

  return (
    <>
      <div className="container-statistics2">
        <Navbar />
        <div className="statistics">
          <div className="orders-container">
            {userData ? (
              <>
                <h1>
                  Statystyki kucharza: {userData.name} {userData.surname}
                </h1>
                <h2>Dla dania: {dishName}</h2>
              </>
            ) : (
              <p>No user data available.</p>
            )}
            <div className="dates-pickers">
              <div className="select-date">
                <label>Data początkowa:</label>
                <input
                  className="date-picker"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="select-date">
                <label>Data końcowa:</label>
                <input
                  className="date-picker"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="select-date-btn">
                <label></label>
                <button onClick={fetchDishStats2} className="search-orders-btn">
                  Pobierz zamówienia
                </button>
              </div>
            </div>

            {dishes.length > 0 && (
              <ul>
                {dishes.map((dish, index) => (
                  <li key={index}>
                    <div className="order-cook-item">
                      <div className="order-cook-id">
                        <h3>
                          <strong>Order ID:</strong> {dish.orderId}
                        </h3>
                      </div>
                      <span>
                        <strong>Order Date:</strong>{" "}
                        {new Date(dish.orderDate).toLocaleString()}
                      </span>
                      <span>
                        <strong>Dish Name:</strong> {dish.dishName}
                      </span>
                      <span>
                        <strong>Quantity:</strong> {dish.quantity}
                      </span>
                      <span className="last-item">
                        <strong>Cooking Time:</strong> {dish.cookingTime}{" "}
                        seconds
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DishStatistics;
