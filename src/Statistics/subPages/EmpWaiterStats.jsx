import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { URL } from "../../shared/consts";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const EmpWaiterStats = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [orders, setOrders] = useState([]);
  const auth = useContext(AuthContext);
  const location = useLocation();
  const { waiterId, waiterName, waiterSurname } = location.state || {};
  const [periodTotal, setPeriodTotal] = useState("rok");
  const [ordersLastWeek, setOrdersLastWeek] = useState([]);
  useEffect(() => {
    const fetchUserOrders = async () => {
      // console.log(waiterId && auth.userId);

      try {
        const responseData = await sendRequest(
          `${URL}/api/waiter/${waiterId ? waiterId : auth.userId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );

        console.log(responseData)

        setOrders(responseData.orders);
      } catch (err) {}
    };
    fetchUserOrders();
  }, [sendRequest, waiterId]);

  useEffect(() => {
    const fetchTipStats = async () => {
      try {
        const responseData = await sendRequest(
          `${URL}/api/waiter/${auth.userId}/waiter-tip-stats`,
          "POST",
          JSON.stringify({ periodTotal }),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );
        console.log(responseData);
        setOrdersLastWeek(responseData);
      } catch (err) {}
    };
    fetchTipStats();
  }, [sendRequest, waiterId]);

  return (
    <>
      <div className="container-statistics2">
        <Navbar />
        <div className="orders-container">
          {isLoading && <LoadingSpinner asOverlay />}
          {orders.length > 0 && (
            <>
            <h1 className="text3">{waiterName + " " + waiterSurname}</h1>
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-item">
                    <div className="order-id">
                      <h2>#{order._id}</h2>
                    </div>
                    <div className="order-item-container">
                      <div className="order-item-left">
                        <p>
                          <strong>Numer stołu:</strong> {order.tableNumber}
                        </p>
                        <p>
                          <strong>Data zamówienia:</strong>{" "}
                          {new Date(order.orderDate).toLocaleString("pl-PL")}
                        </p>
                        <p>
                          <strong>Cena całkowita:</strong> {order.price}{" "}
                          PLN
                        </p>
                        <p>
                          <strong>Wartość napiwku:</strong> {order.tipAmount}{" "}
                          PLN
                        </p>
                      </div>
                      <div className="order-item-right">
                        <h3 className="text6">Potrawy:</h3>
                        <ul>
                          {order.dishes.map((dish, index) => (
                            <li key={index}>
                              <strong>{dish.name}</strong> - {dish.quantity}{" "}
                              szt. ({dish.price} PLN/szt.)
                              <p></p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EmpWaiterStats;
