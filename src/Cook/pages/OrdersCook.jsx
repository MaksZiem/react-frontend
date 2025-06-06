import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useLocation } from "react-router-dom";
import { URL } from "../../shared/consts";
import './OrdersCook.css'

const CookStatistics = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const auth = useContext(AuthContext);
  const [startDate, setStartDate] = useState("");
  let { cookId } = location.state || {};
  const [endDate, setEndDate] = useState("");

  const fetchCookOrders = async () => {
    if (!cookId) {
      cookId = auth.userId;
      console.log(cookId);
    }
    try {
      const responseData = await sendRequest(
        `${URL}/api/cook/dishes-period/${cookId}`,
        "POST",
        JSON.stringify({
          startDate,
          endDate,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      console.log(responseData.orders);
      setOrders(responseData.orders);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCookOrders();
  }, []);

  return (
    <div className="statistics">
      <div className="orders-container">
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
          <button onClick={fetchCookOrders} className="search-orders-btn">
            Pobierz zamówienia
          </button>
        </div>
      </div>

      {/* <div className="text2"> */}
        {isLoading && <LoadingSpinner asOverlay />}
        {!isLoading && orders && (
          <ul className="orders-list3">
            {orders.map((order) => (
              <li key={order.orderId} className="order-cook-item">
                <div className="order-id">
                  <h2>Zamówienie ID: {order.orderId}</h2>
                </div>
                <p>Data zamówienia: {order.orderDate}</p>
                <div>
                  <h3>Dania w zamówieniu:</h3>
                  <ul style={{padding: 0}}>
                    {order.dishes.map((dish, index) => (
                      <li key={index} className="dish-item">
                        <p>Nazwa dania: {dish.dishName}</p>
                        <p>Ilość: {dish.quantity}</p>

                        <p>
                          Czas przygotowania:
                          {dish.cookingTime
                            ? `${dish.cookingTime} sekund`
                            : "Brak danych"}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      {/* </div> */}
      </div>
      </div>
  );
};

export default CookStatistics;
