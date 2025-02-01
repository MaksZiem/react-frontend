import React from "react";
import { useNavigate } from "react-router-dom";
// import "./IngredientItem.css";

const IngredientItem = (props) => {
  const navigate = useNavigate();

  const handleCookClick = (ingredientName, ingredientId) => {
    
    navigate(`/statistics/ingredients/ingredient`, {
      state: { ingredientName: ingredientName, 
        ingredientId: ingredientId
       },
    });
  };

  return (
    <>
    
      <li className={props.isLast ? "last-ingredient2" : "cart-item-ingredient"}> 
          <span className="item-name-ingredient">{props.name}</span>
          <span className="item-category">{props.category}</span>
          <div className="item-action">
          <form action="/api/ingredients/weight-checkout">
            <input
              type="hidden"
              name="ingredientTemplateId"
              value={props.id}
            ></input>

            <button
              type="button"
              className="ingredient-details-button8"
              onClick={() => handleCookClick(props.name, props.id)}
            >
              Szczegóły
            </button>
          </form>
          </div>
      </li>
    </>
  );
};

export default IngredientItem;
