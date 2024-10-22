import React, { useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './Tables.css';

const ReadyDishes = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [readyDishes, setReadyDishes] = useState([]);

  // Pobranie gotowych dań
  useEffect(() => {
    const fetchReadyDishes = async () => {
      try {
        const responseData = await sendRequest('http://localhost:8000/api/waiter/ready-dishes');
        setReadyDishes(responseData.readyDishes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReadyDishes();
  }, [sendRequest]);

  // Funkcja do oznaczania dania jako wydane
  const markDishAsDelivered = async (orderId, dishName) => {
    try {
      await sendRequest(`http://localhost:8000/api/waiter/${orderId}/dish/${dishName}/delivered`, 'PATCH');
      // Po oznaczeniu jako wydane, odśwież listę gotowych dań
      setReadyDishes((prevDishes) => prevDishes.filter(dish => !(dish.orderId === orderId && dish.dishName === dishName)));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {/* Wyświetlanie listy gotowych dań */}
      {!isLoading && readyDishes && (
        <ul className="tables-list">
          {readyDishes.length > 0 ? (
            readyDishes.map((dish, index) => (
              <li key={index} className="table-item">
                <div className="order-info">
                  <p><strong>Numer zamówienia:</strong> {dish.orderId}</p>
                  <p><strong>Numer stolika:</strong> {dish.tableNumber}</p>
                  <p><strong>Danie:</strong> {dish.dishName}</p>
                  <button 
                    className="submit-button"
                    onClick={() => markDishAsDelivered(dish.orderId, dish.dishName)}
                  >
                    Oznacz jako wydane
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>Brak gotowych dań.</p>
          )}
        </ul>
      )}
    </>
  );
};

export default ReadyDishes;
