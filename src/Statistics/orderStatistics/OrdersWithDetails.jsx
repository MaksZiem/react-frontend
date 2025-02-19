import React, { useState } from "react";
import axios from "axios";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import "./OrdersWithDetails.css";
import Navbar from "../components/Navbar";
import { URL } from "../../shared/consts";

const OrdersWithDetails = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  const auth = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:8000/api/statistics/orders/orders-with-details`,
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
      setOrders(responseData.orders || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <div className="container-statistics2">
        <Navbar />
        <div className="orders-container">
          <h1>Historia zamówień</h1>
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
              <button onClick={fetchOrders} className="search-orders-btn">
                Pobierz zamówienia
              </button>
            </div>
          </div>

          {orders.length > 0 && (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.orderId} className="order-item">
                  <div className="order-id">
                    <h2>#{order.orderId}</h2>
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
                        <strong>Cena całkowita:</strong> {order.totalPrice} PLN
                      </p>
                    </div>
                    <div className="order-item-right">
                      <h3 className="text6">Potrawy:</h3>
                      <ul>
                        {order.dishes.map((dish, index) => (
                          <li key={index}>
                            <strong>{dish.dishName}</strong> - {dish.quantity}{" "}
                            szt. ({dish.dishPrice} PLN/szt.)
                            <p>
                              przygotowane przez: {dish.preparedBy},{" "}
                              {new Date(dish.doneByCookDate).toLocaleString(
                                "pl-PL"
                              )}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersWithDetails;
