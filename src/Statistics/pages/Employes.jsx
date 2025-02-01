import React from "react";
import { useNavigate } from "react-router-dom";
import './Employes.css';

const Employes = (props) => {
  const navigate = useNavigate();

  const navigateToCooks = () => {
    navigate(`/statistics/employes`);
  };

  const navigateToWaiters = () => {
    navigate(`/statistics/employes/waiters`);
  };

  return (
    <div>
      <div className="button-center">
        <button
          className={`button-cooks ${props.tab === "cook" ? "active-tab" : ""}`}
          onClick={navigateToCooks}
        >
          Statystyki Kucharzy
        </button>
        <button
          className={`button-waiters ${props.tab === "waiter" ? "active-tab" : ""}`}
          onClick={navigateToWaiters}
        >
          Statystyki Kelnerów
        </button>
      </div>
    </div>
  );
};

export default Employes;
