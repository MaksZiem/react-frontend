import { useHttpClient } from "../../shared/hooks/http-hook";
import React, { useEffect, useState, useContext } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import "./AllWaiters.css";
import Employes from "../pages/Employes";
import Navbar from "../components/Navbar";
import { URL } from "../../shared/consts";

const AllWaiters = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [waiters, setWaiters] = useState([]);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        const responseData = await sendRequest(
          `${URL}/api/statistics/waiters`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        console.log(responseData.waiters)
        setWaiters(responseData.waiters);
      } catch (err) {}
    };
    fetchWaiters();
  }, [sendRequest]);

  const handleWaiterClick = (waiterId, waiterName, waiterSurname) => {
    console.log(waiterName)
    navigate(`/statistics/waiter`, {
      state: { waiterId: waiterId, waiterName: waiterName, waiterSurname },
    });
  };

  return (
    <div>
      <ErrorModal error={error} onClear={clearError} />
        <div className="container-statistics">
          <Navbar />
          <div className="content">
          <Employes tab="waiter" />
          {isLoading && <LoadingSpinner asOverlay />}
          {!isLoading && waiters && (
            <div className="cook-stats-details">
            <h1 className="text">lista kelnerów</h1>
            <div className="place-list-form-placeholder-ingredient">
            <div className="cook-list-desc">
              <div className="cook-image">zdjecie</div>
              <span className="cook-name">imie</span>
              <span className="cook-name">nazwisko</span>
              <span className="cook-surname">średni napiwek</span>
              <span className="cook-pesel">ilosc zamówień</span>
              <span className="cook-action">napiwki</span>
            </div>
          </div>
          <ul className="list-form-cooks">
            {waiters.map((waiter, index) => (
              <li
                key={waiter.id}
                 onClick={() => handleWaiterClick(waiter.waiterId, waiter.waiterName, waiter.surname)}
                className={
                  index === waiters.length - 1
                    ? "last-cook"
                    : "cook-list-item"
                }
              >
                  <div className="cook-image">
                    <img
                      className="image"
                      src={`${URL}/uploads/images/${waiter.image}`}
                      alt={waiter.name}
                    />
                  </div>
                  <span className="cook-name">
                    {waiter.waiterName}
                  </span>
                  <span className="cook-name">{waiter.surname}</span>
                  <span className="cook-surname">
                    {waiter.averageTip.toFixed(2)} PLN
                  </span>
                  <span className="cook-pesel">{waiter.orderCount}</span>
                  <span className="cook-action">
                    {waiter.totalTips.toFixed(2)} PLN
                  </span>
              </li>
            ))}
          </ul>
   
        </div>
      )}
      </div>
      </div>
    </div>
  );
};

export default AllWaiters;
