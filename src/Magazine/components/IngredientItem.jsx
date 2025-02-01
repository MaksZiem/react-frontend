import React from "react";
import "./IngredientItem.css";
import { formatDate } from "../../shared/util/formatDate";

const IngredientItem = (props) => {
  return (
    <li className={props.isLast ? "last-ingredient2" : "cart-item-ingredient"}>
        <span className="item-name-ingredient">{props.name}</span>
        <span className="item-category">{props.category}</span>
        <span className="item-category">{formatDate(props.expirationDate)}</span>
        <div className="item-action">
          <form action="/api/ingredients/weight-checkout">
            <input type="hidden" name="ingredientTemplateId" value={props.id}></input>
            <button
              type="button"
              className="ingredient-details-button2"
              onClick={() => props.onDelete(props.id)}
            >
              Usuń
            </button>
          </form>
        </div>
    </li>
  );
};

export default IngredientItem;
