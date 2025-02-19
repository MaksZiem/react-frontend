import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { URL } from "../../shared/consts";

const Summary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const { isLoading, error, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const responseData = await sendRequest(
          `${URL}/api/statistics/orders/summary`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setSummaryData(responseData);
      } catch (err) {
        console.error("Błąd podczas pobierania podsumowania:", err);
      }
    };

    fetchSummary();
  }, [sendRequest, auth.token]);

  return (
    <div>
      <h2>Podsumowanie dzisiejsze</h2>
      {isLoading && <p>Ładowanie danych...</p>}
      {error && <p>Błąd: {error}</p>}
      {summaryData && (
        <div>
          <p>
            <strong>Całkowity zysk:</strong> {summaryData.totalProfit}
          </p>
          <p>
            <strong>Liczba zamówień:</strong> {summaryData.totalOrders}
          </p>

          <h3>Top 5 zarabiających dań</h3>
          {summaryData.top5Earners.length > 0 ? (
            <ul>
              {summaryData.top5Earners.map((item, index) => (
                <li key={index}>
                  <strong>{item.dish.name}</strong> – Zysk:{" "}
                  {parseFloat(item.totalProfit).toFixed(2)}, Porcji:{" "}
                  {item.totalQuantity}
                </li>
              ))}
            </ul>
          ) : (
            <p>Brak danych</p>
          )}

          <h3>Top 5 tracących/mały zysk</h3>
          {summaryData.top5Losers.length > 0 ? (
            <ul>
              {summaryData.top5Losers.map((item, index) => (
                <li key={index}>
                  <strong>{item.dish.name}</strong> – Zysk:{" "}
                  {parseFloat(item.totalProfit).toFixed(2)}, Porcji:{" "}
                  {item.totalQuantity}
                </li>
              ))}
            </ul>
          ) : (
            <p>Brak danych</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Summary;
