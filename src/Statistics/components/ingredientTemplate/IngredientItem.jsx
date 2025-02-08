import React from "react";
import { useNavigate } from "react-router-dom";
import "./IngredientItem.css";
import { useParams } from "react-router-dom";

const IngredientItem = (props) => {
  const navigate = useNavigate();
  const { dishId } = useParams();

  const handleButtonClick = () => {
    navigate(`/statistics/dishes/update/${dishId}/weight-checkout`, {
      state: {
        name: props.name,
        category: props.category,
        id: props.id,
      },
    });
  };

  return (
    <li className={props.isLast ? "last-ingredient2" : "cart-item-ingredient"}>    
        <span className="item-name-ingredient">{props.name}</span>
        <span className="item-category">{props.category}</span>
        <div className="item-action">
          <form action="/api/ingredients/weight-checkout">
            <input type="hidden" name="ingredientTemplateId" value={props.id}></input>
            <button
              type="button"
              className="ingredient-details-button2"
              onClick={handleButtonClick}
            >
              Dodaj do dania
            </button>
          </form>
        </div>      
    </li>
  );
};

export default IngredientItem;
