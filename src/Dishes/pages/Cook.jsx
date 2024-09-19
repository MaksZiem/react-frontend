import React, { useState, useEffect } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook'; // Hook HTTP
import Card from '../../shared/components/UIElements/Card';
import './Tables.css'

const Cook = () => {
  const [waitingOrders, setWaitingOrders] = useState([]);
  const { sendRequest } = useHttpClient();

  // Pobranie zamówień o statusie "waiting"
  useEffect(() => {
    const fetchWaitingOrders = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/dishes/waiting-orders');
        setWaitingOrders(responseData.orders); // Zakładam, że zamówienia są w responseData.orders
      } catch (err) {
        console.error(err);
      }
    };
    fetchWaitingOrders();
  }, [sendRequest]);

  // Funkcja zmieniająca status zamówienia na "delivered"
  const handleMarkAsDelivered = async (orderId) => {
    console.log('aaa')
    try {
      await sendRequest(`http://localhost:5000/api/dishes/${orderId}/delivered`, 'PATCH'); // Zakładam, że endpoint opiera się na orderId
      // Aktualizacja stanu zamówień po zmianie statusu
      setWaitingOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      
      {waitingOrders.length === 0 ? (
        <span className='text3'>Brak zamówień</span>
      ) : (
        <ul className='tables-list'>
        {waitingOrders.map(order => (
          <li key={order._id} className='table-item border'>
            
              <div className='order-info'>
                <p><strong>Zamówienie</strong></p>
                <p>#{order._id}</p>
                <p><strong>Kwota:</strong> {order.price} zł</p>
                <p><strong>Data zamówienia:</strong> {order.orderDate}</p>
                
              </div>
                <span>Dania w zamówieniu:</span>
              
                <ul className='item-list'>
                  {order.dishes.map(dishItem => (
                    <li key={dishItem.dish._id} > 
                      <span className='table-dishes'>{dishItem.dish.name}</span>
                      <span className='table-dishes'>x {dishItem.quantity}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="submit-button4"  onClick={() => handleMarkAsDelivered(order._id)}>
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
