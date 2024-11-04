import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useLocation } from "react-router-dom";
const DishStatistics = () => {
const location = useLocation();
  const { cookId, dishId } = location.state || {};
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [dishStats, setDishStats] = useState(null);
  const [totalDishesPrepared, setTotalDishesPrepared] = useState(0);
  const [averageCookingTime, setAverageCookingTime] = useState(0);
  const auth = useContext(AuthContext); 

  useEffect(() => {
    const fetchDishStats = async () => {
      try {
        const responseData = await sendRequest(
            
          `http://localhost:8000/api/cook/dish/${dishId}/stats/${cookId}`, 
          "GET",
          null,
          { Authorization: "Bearer " + auth.token } 
        );
        console.log(responseData.preparationCounts)
        setDishStats(responseData.history); 
        setTotalDishesPrepared(responseData.totalDishesPrepared); 
        setAverageCookingTime(responseData.averageCookingTime); 
      } catch (err) {
        
      }
    };

    fetchDishStats();
  }, [sendRequest, dishId, auth.userId, auth.token]); 

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
    <h1>welcome</h1>
      {!isLoading && dishStats && (
        <div>
          <h2>Statystyki dla dania ID: {dishId}</h2>
          <h3>Łączna liczba przygotowanych dań: {totalDishesPrepared}</h3>
          <h3>Średni czas gotowania: {averageCookingTime} sekund</h3>
          <ul>
            {dishStats.map((stat) => (
              <li key={stat.orderId}>
                <p>Zamówienie ID: {stat.orderId}</p>
                <p>Numer stolika: {stat.tableNumber}</p>
                <p>Data zamówienia: {new Date(stat.orderDate).toLocaleString()}</p>
                <p>Data zakończenia przygotowania: {new Date(stat.doneByCookDate).toLocaleString()}</p>
                <p>Czas przygotowania: {stat.cookingTime} sekund</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default DishStatistics;
