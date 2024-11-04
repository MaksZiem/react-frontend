import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { Link } from "react-router-dom";
import DishList from "../components/DishList";
import { useNavigate } from "react-router-dom";

const EmpCookStats = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [orders, setOrders] = useState([]);
  const [counts, setCounts] = useState({});
  const [dishes, setDishes] = useState([]);
  const location = useLocation();
  const { cookId } = location.state || {};
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookId) {
      console.error("Cook ID is not provided");
      return;
    }

    const fetchCookOrders = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/cook/${cookId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );

        const responseData2 = await sendRequest(
          `http://localhost:8000/api/cook/dishes-count/${cookId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );

        const responseDishes = await sendRequest(
          `http://localhost:8000/api/dishes/`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );

        setCounts(responseData2.counts);
        setOrders(responseData.orders);
        setDishes(responseDishes.dishes);
      } catch (err) {}
    };
    fetchCookOrders();
  }, [sendRequest, cookId]);

  const handleCookClick = (dishId) => {
    console.log("dishId: " + dishId);
    console.log("cookId" + cookId);
    navigate(`/dish/stats`, {
      state: { cookId: cookId, dishId: dishId },
    });
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}

      {!isLoading && orders && (
        <>
          <ul className="orders-list">
            {orders.map((order) => (
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
                          {dish.cookingTime
                            ? `${dish.cookingTime} sekund`
                            : "Brak danych"}
                        </p>
                        {/* Dodajemy przycisk do nawigacji */}
                        {/* <Link to={`/dishes/${dish.dishId}/stats`}>
                          <button>Statystyki dania</button>
                        </Link> */}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>

          <div>
            <h3>Statystyki:</h3>
            <ul>
              <li>Dzisiaj: {counts.today || 0}</li>
              <li>Ostatni tydzień: {counts.lastWeek || 0}</li>
              <li>Ostatni miesiąc: {counts.lastMonth || 0}</li>
              <li>Ostatni rok: {counts.lastYear || 0}</li>
            </ul>
          </div>

          <div>
            <h3>Dania:</h3>
            <div className="place-list-form-placeholder-ingredient">
              <div className="ingredients-list-desc">
                <span className="item-name-ingredient">nazwa</span>
                <span className="item-category">cena</span>
                <span className="item-category">dostepnosc</span>
                <span className="item-action">akcje</span>
              </div>
            </div>
            <ul className="place-list-form-ingredient">
              {dishes.map((dish) => (
                <li key={dish._id}>
                  <div className="cart-item-ingredient">
                    <span className="item-name-ingredient">{dish.name}</span>
                    <span className="item-category">{dish.price} PLN</span>
                    <span className="item-category">
                      {dish.isAvailable ? "Dostępne" : "Niedostępne"}
                    </span>
                    <div className="item-action">
                    <button
                      className="ingredient-details-button4"
                      onClick={() => {
                        handleCookClick(dish._id);
                      }}
                    >
                      Statystyki dania
                    </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default EmpCookStats;
