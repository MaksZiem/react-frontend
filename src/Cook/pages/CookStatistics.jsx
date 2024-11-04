import React, { useEffect, useState, useContext } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const CookStatistics = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [orders, setOrders] = useState([]);
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchCookOrders = async () => {
            try {
                console.log(auth.userId)
                const responseData = await sendRequest(
                    `http://localhost:8000/api/cook/${auth.userId}`, 
                    'GET',
                    null,
                    { Authorization: 'Bearer ' + auth.token }
                );
                console.log(responseData.orders)
                setOrders(responseData.orders);
            } catch (err) {
                console.log(err)
            }
        };
        fetchCookOrders();
    }, [sendRequest, auth.userId, auth.token]);

    return (
        <>
        {/* <h1>welcome</h1> */}
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            {!isLoading && orders && (
                <ul className="orders-list">
                    {orders.map(order => (
                        <li key={order.orderId} className="order-item">
                            <h2>Zamówienie ID: {order.orderId}</h2>
                            <p>Data zamówienia: {order.orderDate}</p>
                            
                            
                            <div>
                                <h3>Dania w zamówieniu:</h3>
                                <ul>
                                    {order.dishes.map((dish, index) => (
                                        <li key={index} className="dish-item">
                                            <p>Nazwa dania: {dish.dishName}</p>
                                            <p>Ilość: {dish.quantity}</p>
                                            
                                            <p>
                                                Czas przygotowania: 
                                                {dish.cookingTime ? `${dish.cookingTime} sekund` : "Brak danych"}
                                            </p>
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

export default CookStatistics;
