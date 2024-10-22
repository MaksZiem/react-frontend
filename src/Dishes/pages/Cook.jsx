import React, { useState, useEffect } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook'; // Hook HTTP
import Card from '../../shared/components/UIElements/Card';
import './Tables.css';

const Cook = () => {
  const [waitingOrders, setWaitingOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { sendRequest } = useHttpClient();

  // Pobranie zamówień o statusie "waiting"
  useEffect(() => {
    const fetchWaitingOrders = async () => {
      setIsLoading(true);  // Ustawienie stanu ładowania
      setError(null);  // Czyszczenie błędów
      try {
        const responseData = await sendRequest('http://localhost:8000/api/cook/waiting-orders');
        setWaitingOrders(responseData.orders); // Zakładam, że zamówienia są w responseData.orders
      } catch (err) {
        setError('Wystąpił problem podczas ładowania zamówień.');  // Obsługa błędów
      }
      setIsLoading(false);  // Wyłączenie stanu ładowania
    };
    fetchWaitingOrders();
  }, [sendRequest]);

  // Funkcja zmieniająca status zamówienia na "delivered"
  const handleMarkAsDelivered = async (orderId) => {
    try {
      await sendRequest(`http://localhost:8000/api/cook/${orderId}/delivered`, 'PATCH'); // Endpoint do zmiany statusu zamówienia
      // Aktualizacja stanu zamówień po zmianie statusu
      setWaitingOrders((prevOrders) => prevOrders.filter(order => order.orderId !== orderId));
    } catch (err) {
      console.error(err);
    }
  };

  // Funkcja zmieniająca status dania na "gotowy"
  const handleMarkDishAsReady = async (orderId, dishName) => {
    try {
      await sendRequest(`http://localhost:8000/api/cook/${orderId}/dish/${dishName}/ready`, 'PATCH'); // Endpoint do zmiany statusu dania
      // Aktualizacja stanu zamówień po zmianie statusu dania
      setWaitingOrders(prevOrders =>
        prevOrders.map(order => {
          if (order.orderId === orderId) {
            return {
              ...order,
              dishes: order.dishes.map(dish =>
                dish.dishName === dishName
                  ? { ...dish, status: 'gotowy' }
                  : dish
              )
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
        <span className='text3'>Brak zamówień</span>
      )}

      {!isLoading && waitingOrders.length > 0 && (
        <ul className='tables-list'>
          {waitingOrders.map(order => (
            <li key={order.orderId} className='table-item border'>
              <div className='order-info'>
                <p><strong>Zamówienie:</strong> #{order.orderId}</p>
                <p><strong>Kwota:</strong> {order.price} zł</p>
                <p><strong>Data zamówienia:</strong> {order.orderDate}</p>
                <p><strong>Numer stolika:</strong> {order.tableNumber}</p>
              </div>

              <span>Dania w zamówieniu:</span>
              <ul className='item-list'>
                {order.dishes.map((dishItem, index) => (
                  <li key={index}>
                    <span className='table-dishes'>{dishItem.dishName}</span>
                    <span className='table-dishes'>x {dishItem.quantity}</span>
                    <span className={`table-dishes ${dishItem.status === 'gotowy' ? 'ready' : ''}`}>{dishItem.status}</span>

                    {/* Przycisk zmieniający status dania na "gotowy" */}
                    {dishItem.status !== 'gotowy' && (
                      <button
                        className="submit-button4"
                        onClick={() => handleMarkDishAsReady(order.orderId, dishItem.dishName)}
                      >
                        Oznacz jako gotowe
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              <button
                className="submit-button4"
                onClick={() => handleMarkAsDelivered(order.orderId)}
              >
                Oznacz jako wykonane
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cook;
