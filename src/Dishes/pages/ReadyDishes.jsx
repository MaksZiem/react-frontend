import React, { useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './Tables.css';
import { io } from 'socket.io-client';
const ReadyDishes = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [readyDishes, setReadyDishes] = useState([]);

  useEffect(() => {
    // Funkcja do pobrania początkowych danych
    const fetchReadyDishes = async () => {
      try {
        const responseData = await sendRequest('http://localhost:8000/api/waiter/ready-dishes');
        setReadyDishes(responseData.readyDishes || []); // Obsługa braku danych
      } catch (err) {
        console.log('Error fetching ready dishes:', err);
      }
    };

    fetchReadyDishes();

    // Połączenie z Socket.IO
    // const socket = io('http://localhost:8000'); // Backend Socket.IO URL
    const socket = io('http://localhost:8001', { transports: ['websocket'] });


    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('dishReady', (newDish) => {
      console.log('New dish ready:', newDish);
      setReadyDishes((prevDishes) => [...prevDishes, newDish]);
    });

    socket.on('dishDelivered', ({ orderId, dishName }) => {
      console.log(`Dish delivered: ${dishName} from order ${orderId}`);
      setReadyDishes((prevDishes) =>
        prevDishes.filter((dish) => !(dish.orderId === orderId && dish.dishName === dishName))
      );
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socket.disconnect(); // Czyszczenie połączenia przy odmontowaniu komponentu
    };
  }, [sendRequest]);
  
  const markDishAsDelivered = async (orderId, dishName) => {
    try {
      await sendRequest(`http://localhost:8000/api/waiter/${orderId}/dish/${dishName}/delivered`, 'PATCH');
      // setReadyDishes((prevDishes) => prevDishes.filter(dish => !(dish.orderId === orderId && dish.dishName === dishName)));
      setReadyDishes((prevDishes) =>
        prevDishes.filter((dish) => !(dish.orderId === orderId && dish.dishName === dishName))
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      
      {!isLoading && readyDishes.length === 0 && (
        <h1 className="text3">Brak gotowych dań do odebrania</h1>
      )}
      
      {!isLoading && readyDishes.length > 0 && (
        <ul className="dish-to-cook">
          {readyDishes.map((dish, index) => (
            <li key={index} className="order-item-cook">
              <div className="order-info">
                <p><strong>Numer zamówienia:</strong> {dish.orderId}</p>
                <p><strong>Numer stolika:</strong> {dish.tableNumber}</p>
                <p><strong>Danie:</strong> {dish.dishName}</p>
                <button 
                  className="make-dish-ready"
                  onClick={() => markDishAsDelivered(dish.orderId, dish.dishName)}
                >
                  Oznacz jako wydane
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ReadyDishes;
