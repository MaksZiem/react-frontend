import React, { useEffect, useState, useContext } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { URL } from '../../shared/consts';

const WaiterStatistics = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [orders, setOrders] = useState([]);
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const responseData = await sendRequest(
                    `${URL}/api/waiter/${auth.userId}`, 
                    'GET',
                    null,
                    { Authorization: 'Bearer ' + auth.token }
                );
                setOrders(responseData.orders);
            } catch (err) {}
        };
        fetchUserOrders();
    }, [sendRequest, auth.userId, auth.token]);

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

export default WaiterStatistics;
