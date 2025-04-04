import React from "react";
import { useNavigate } from "react-router-dom";
// import "./IngredientWasteItem.css";
import { formatDaysToDaysAndHours } from "../../../shared/util/formatDaysToHour";

const IngredientWasteItem = (props) => {
  return (
    <>
    
      <li className={props.isLast ? "last-ingredient2" : "cart-item-ingredient"}> 
          <span className="item-name-ingredient">{props.ingredientName}</span>
          <span className="item-category">{props.averageDailyUsage}</span>
          <span className="item-category">{props.shortageProbability}</span>
          <span className="item-category">{formatDaysToDaysAndHours(props.daysUntilOutOfStock)}</span>
      </li>
    </>
  );
};

export default IngredientWasteItem;
