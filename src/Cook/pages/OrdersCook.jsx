import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useLocation } from "react-router-dom";
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
      // console.log(auth.userId);
      const responseData = await sendRequest(
        `http://localhost:8000/api/cook/dish-prepared-by-cook/${cookId}`,
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
    <>
      {/* <h1>welcome</h1> */}
      {/* <ErrorModal error={error} onClear={clearError} /> */}
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

      <div className="text2">
        {isLoading && <LoadingSpinner asOverlay />}
        {!isLoading && orders && (
          <ul className="orders-list">
            {orders.map((order) => (
              <li key={order.orderId} className="order-item">
                <div className="order-id">
                  <h2>Zamówienie ID: {order.orderId}</h2>
                </div>
                <p>Data zamówienia: {order.orderDate}</p>
                <div>
                  <h3>Dania w zamówieniu:</h3>
                  <ul>
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
      </div>
    </>
  );
};

export default CookStatistics;
