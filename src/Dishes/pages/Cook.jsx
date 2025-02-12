import React, { useState, useEffect } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Tables.css";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { convertToPolishTime } from "../../shared/util/formatToConvertDate";
import "./Cook.css";
import { URL } from "../../shared/consts";
import { io } from "socket.io-client";

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
          `${URL}/api/cook/waiting-orders`,
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

    const socket = io("http://localhost:8001");
    socket.on("newOrder", (newOrder) => {
      setWaitingOrders((prevOrders) => [...prevOrders, newOrder]);
    });

    return () => {
      socket.disconnect();
    };
  }, [sendRequest]);

  const handleMarkDishAsReady = async (orderId, dishName) => {
    try {
      await sendRequest(
        `${URL}/api/cook/${orderId}/dish/${dishName}/ready`,
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
      {error && <h1 className="text3">{error}</h1>}

      {!isLoading && waitingOrders.length > 0 && (
        <ul className="dish-to-cook">
          {waitingOrders.map((order) => (
            <li key={order.orderId} className="order-item-cook">
              <div className="order-info">
                <p>
                  <strong>Data zamówienia:</strong>{" "}
                  {convertToPolishTime(order.orderDate)}
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

                    {dishItem.status === "gotowy" ||
                    dishItem.status === "wydane" ? (
                      <button className="dish-ready">Oznacz jako gotowe</button>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cook;
