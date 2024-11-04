import React, { useEffect, useState, useContext } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useLocation } from 'react-router-dom';

const EmpWaiterStats = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [orders, setOrders] = useState([]);
    const auth = useContext(AuthContext);
    const location = useLocation();
  const { waiterId } = location.state || {};

    useEffect(() => {
        console.log(waiterId)
        const fetchUserOrders = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:8000/api/waiter/${waiterId}`, 
                    'GET',
                    null,
                    { Authorization: 'Bearer ' + auth.token }
                );
                setOrders(responseData.orders);
            } catch (err) {}
        };
        fetchUserOrders();
    }, [sendRequest, waiterId]);

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            {!isLoading && orders && (
                <ul className="orders-list">
                    {orders.map(order => (
                        <li key={order._id} className="order-item">
                            <h3>Data zamówienia: {order.orderDate}</h3>
                            <p>Numer stolika: {order.tableNumber}</p>
                            <p>Łączna cena: {order.price} zł</p>
                            <p>Napiwek: {order.tipAmount ? `${order.tipAmount} zł` : "Brak"}</p>
                            <div>
                                <h4>Dania w zamówieniu:</h4>
                                <ul>
                                    {order.dishes.map((dish, index) => (
                                        <li key={index}>
                                            {dish.name} - {dish.quantity} szt., {dish.price} zł
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default EmpWaiterStats;
