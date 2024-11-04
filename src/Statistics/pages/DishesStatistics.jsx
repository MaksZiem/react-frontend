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
import "./DishesStatistics.css";

const DishesStatistics = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [dishes, setDishes] = useState([]);
  const location = useLocation();

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCookOrders = async () => {
      try {
        const responseDishes = await sendRequest(
          `http://localhost:8000/api/dishes/`,
          "GET"
        );

        setDishes(responseDishes.dishes);
      } catch (err) {}
    };
    fetchCookOrders();
  }, []);

  const handleCookClick = (dishId) => {
    console.log("dishId: " + dishId);
    navigate(`/statistics/dishes/dish`, {
      state: { dishId: dishId },
    });
  };

  return (
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
              {/* <p>Cena: {dish.price} PLN</p> */}
              <span className="item-category">{dish.price} PLN</span>
              <span className="item-category">
                {dish.isAvailable ? "Dostępne" : "Niedostępne"}
              </span>
              <div className="item-action">
                <button
                  onClick={() => {
                    handleCookClick(dish._id);
                  }}
                  className="ingredient-details-button4"
                >
                  Statystyki dania
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DishesStatistics;
