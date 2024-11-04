import React, { useState, useEffect } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UIElements/Card";
import "./Tables.css";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import "./Cook.css";

const Cook = () => {
  const auth = useContext(AuthContext);
  const [waitingOrders, setWaitingOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchWaitingOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const responseData = await sendRequest(
          "http://localhost:8000/api/cook/waiting-orders",
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        setWaitingOrders(responseData.orders);
        console.log(responseData.orders);
      } catch (err) {
        setError("Brak dań do wykonania");
      }
      setIsLoading(false);
    };
    fetchWaitingOrders();
  }, [sendRequest]);

  const handleMarkAsDelivered = async (orderId) => {
    try {
      await sendRequest(
        `http://localhost:8000/api/cook/${orderId}/delivered`,
        "PATCH",
        null,
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );

      setWaitingOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderId !== orderId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkDishAsReady = async (orderId, dishName) => {
    try {
      await sendRequest(
        `http://localhost:8000/api/cook/${orderId}/dish/${dishName}/ready`,
        "PATCH",
        null,
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );

      setWaitingOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.orderId === orderId) {
            return {
              ...order,
              dishes: order.dishes.map((dish) =>
                dish.dishName === dishName
                  ? { ...dish, status: "gotowy" }
                  : dish
              ),
            };
          }
          return order;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Obsługa stanów ładowania i błędów */}
      {isLoading && <p>Ładowanie zamówień...</p>}
      {error && <p>{error}</p>}

      {!isLoading && waitingOrders.length === 0 && !error && (
        <span className="text3">Brak zamówień</span>
      )}

      {!isLoading && waitingOrders.length > 0 && (
        <ul className="orders-list">
          {waitingOrders.map((order) => (
            <li key={order.orderId} className="order-item">
              <div className="order-info">
                <p>
                  <strong>Data zamówienia:</strong> {order.orderDate}
                </p>
                <p>
                  <strong>Numer stolika:</strong> {order.tableNumber}
                </p>
              </div>

              <div className="dishes-in-order">Dania w zamówieniu:</div>
              <ul className="order-list">
                {order.dishes.map((dishItem, index) => (
                  <li key={index}>
                    <span className="order-name">{dishItem.dishName}</span>
                    <span className="order-quantity ">
                      x {dishItem.quantity}
                    </span>
                    <span
                      className={`order-dish-status  ${
                        dishItem.status === "gotowy" ? "ready" : ""
                      }`}
                    >
                      {dishItem.status}
                    </span>

                    {/* Przycisk zmieniający status dania na "gotowy" */}
                    {dishItem.status === "gotowy" ? (
                      <button
                        
                        className="dish-ready"
                      >
                        Oznacz jako gotowe
                      </button>
                    ) : (
                      <button
                        className="make-dish-ready"
                        onClick={() =>
                          handleMarkDishAsReady(
                            order.orderId,
                            dishItem.dishName,
                            dishItem.id
                          )
                        }
                      >
                        Oznacz jako gotowe
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              {/* <button
                className="submit-button4"
                onClick={() => handleMarkAsDelivered(order.orderId)}
              >
                Oznacz jako wykonane
              </button> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cook;
