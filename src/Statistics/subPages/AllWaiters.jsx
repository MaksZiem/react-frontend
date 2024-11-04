import React, { useEffect, useState, useContext } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useNavigate } from 'react-router-dom';
import './AllWaiters.css'
import Employes from '../pages/Employes';
const AllWaiters = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [waiters, setWaiters] = useState([]);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:8000/api/statistics/waiters',
          'GET',
          null,
          { Authorization: 'Bearer ' + auth.token }
        );
        setWaiters(responseData.waiters);
      } catch (err) {}
    };
    fetchWaiters();
  }, [sendRequest]);

  const handleWaiterClick = (waiterId) => {
    navigate(`/statistic/waiter`, {
        state: { waiterId: waiterId }
    });
};

  return (
    <div>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && waiters && (
        <>
        <Employes tab="waiter" />
        <h1 className="text">lista kelnerów</h1>
      <div className="place-list-form-placeholder-ingredient">
        <div className="cart-item-ingredient2">
          <span className="item-name-ingredient">kelner</span>
          <span className="item-action">redni napiwek</span>
          <span className="item-category">łączna liczba zamówień</span>
          <span className="item-category">Łączna suma napiwków</span>
        </div>
        </div>
        <ul className="place-list-form-ingredient">
          {waiters.map(waiter => (
            <li key={waiter.waiterId} onClick={() => handleWaiterClick(waiter.waiterId)}>
                <div className="cart-item-ingredient">
                <span className="item-name-ingredient">{waiter.waiterName}</span>
                <span className="item-category">{waiter.averageTip.toFixed(2)} PLN</span>
                <span className="item-category">{waiter.orderCount}</span>
                <span className="item-category">{waiter.totalTips.toFixed(2)} PLN</span>
              {/* <h3>Kelner: {waiter.waiterName}</h3>
              <p>Średni napiwek: {waiter.averageTip.toFixed(2)} PLN</p> */}
              {/* <p>Łączna liczba zamówień: {waiter.orderCount}</p>
              <p>Łączna suma napiwków: {waiter.totalTips.toFixed(2)} PLN</p> */}
              </div>
            </li>
          ))}
        </ul>
        </>
      )}
    </div>
  );
};

export default AllWaiters;
