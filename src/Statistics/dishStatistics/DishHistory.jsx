import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { URL } from "../../shared/consts";
import Navbar from "../components/Navbar";
import { LineChart } from "@mui/x-charts/LineChart";

const DishHistory = () => {
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [submittedStartDate, setSubmittedStartDate] = useState("");
  const [submittedEndDate, setSubmittedEndDate] = useState("");
  const [dishData, setDishData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const location = useLocation();
  const { dishId } = location.state || {};
  const { sendRequest, error } = useHttpClient();
  const auth = useContext(AuthContext);
  const initialColor = "rgb(117, 148, 215)";

  useEffect(() => {
    const fetchDishHistory = async () => {
      console.log("dsa");
      setLoading(true);
      try {
        const responseData = await sendRequest(
          `${URL}/api/statistics/dishes/${dishId}/history`,
          "POST",
          JSON.stringify({
            startDate: submittedStartDate,
            endDate: submittedEndDate,
          }),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );
        console.log(responseData);
        setDishData(responseData);
      } catch (err) {
        console.error("Błąd podczas pobierania historii:", err);
      }
      setLoading(false);
    };

    fetchDishHistory();
  }, [dishId, submittedStartDate, submittedEndDate, sendRequest, auth.token]);

  useEffect(() => {
    if (dishData && dishData.occurrencesByMonth) {
      const quantityArray = dishData.occurrencesByMonth.map(
        (item) => item.quantity
      );
      const uniqueLabels = dishData.occurrencesByMonth.map(
        (item) => item.period
      );

      setQuantities(quantityArray);
      setLabels(uniqueLabels);
      console.log("Labels:", uniqueLabels);
      console.log("Quantities:", quantityArray);
    }
  }, [dishData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date();
    const defaultEnd = today.toISOString().split("T")[0];
    const defaultStart = new Date();
    defaultStart.setFullYear(defaultStart.getFullYear() - 1);
    const defaultStartStr = defaultStart.toISOString().split("T")[0];

    setSubmittedStartDate(formStartDate || defaultStartStr);
    setSubmittedEndDate(formEndDate || defaultEnd);
  };

  return (
    <div className="container-statistics2">
      <Navbar />
      <div className="orders-container">
        <h2>Historia sprzedaży dania</h2>
        <div className="dates-pickers">
          <div className="select-date">
            <label>Data początkowa:</label>
            <input
              className="date-picker"
              type="date"
              value={formStartDate}
              onChange={(e) => setFormStartDate(e.target.value)}
            />
          </div>
          <div className="select-date">
            <label>Data końcowa:</label>
            <input
              className="date-picker"
              type="date"
              value={formEndDate}
              onChange={(e) => setFormEndDate(e.target.value)}
            />
          </div>
          <div className="select-date-btn">
            <label></label>
            <button className="search-orders-btn" onClick={handleSubmit}>
              Pokaż historię
            </button>
          </div>
        </div>

        {loading && <p>Ładowanie danych...</p>}
        {error && <p>Błąd: {error}</p>}

        {dishData && (
          <>
            <div className="dish-info2">
              <div className="dish-info-content2">
                <h1>{dishData.dish.name}</h1>
                <p>
                  <strong>Cena:</strong> {dishData.dish.price}
                </p>

                <h2>Podsumowanie sprzedaży</h2>
                <p>
                  <strong>Łączny przychód:</strong> {dishData.totalRevenue}
                </p>
                <p>
                  <strong>Łączna liczba sprzedanych porcji:</strong>{" "}
                  {dishData.totalQuantity}
                </p>

                <h2>Średnia Marża</h2>
                <p>
                  <strong>Wartość:</strong> {dishData.profitMargin.value} |{" "}
                  <strong>Procent:</strong> {dishData.profitMargin.percentage}%
                </p>
                <div className="ranking">
                  <h2>Przychód za danie na przestrzeni czasu</h2>
                  <div className="pie-chart-statistics-placeholder">
                    {labels && quantities && (
                      <LineChart
                        xAxis={[
                          {
                            scaleType: "band",
                            data: labels,

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
                            data: quantities,
                            color: initialColor,
                            area: true,
                          },
                        ]}
                        colors={{ scheme: "nivo" }}
                        height={300}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <h1>Historia zamówień</h1>

            <div className="orders-list">
              {dishData.orderHistory.map((order) => (
                <div key={order.orderId} className="order-item">
                  <div className="order-id">
                    <h2>{new Date(order.orderDate).toLocaleString()}</h2>
                  </div>
                  <div className="order-item-container">
                    <div className="order-item-left">
                      <p>
                        <strong>Numer stołu:</strong> {order.tableNumber}
                      </p>
                      <p>
                        <strong>Ilość:</strong> {order.quantity}
                      </p>
                      <p>
                        <strong>Zarobek:</strong> {order.dishProfit}
                      </p>
                    </div>
                    <div className="order-item-right">
                      <h3 className="text6">Składniki:</h3>
                      <ul>
                        {order.ingredients.map((ing, idx) => (
                          <li key={idx}>
                            <strong>{ing.name}:</strong>
                            {ing.weight}
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
  );
};

export default DishHistory;
