import React from "react";
import IngredientWasteItem from "./IngredientWasteItem";

const IngredientWasteList = (props) => {
  if (props.ingredientTemplates.length === 0) {
    return (
      <div className="place-list center">
        <h2>Nie znaleziono składników</h2>
      </div>
    );
  }

  return (
    <>
      <div className="place-list-form-placeholder-ingredient">
        <div className="ingredients-list-desc">
          <span className="item-name-ingredient">Nazwa</span>
          <span className="item-category">Średnie dzienne zużycie</span>
          <span className="item-category">Całkowita ilość w magazynie</span>
          <span className="item-category">Dni do wyczerpania zapasów</span>
        </div>
      </div>
      <ul className="place-list-form-ingredient">
        {props.ingredientTemplates.map((ingredient, index) => (
          <IngredientWasteItem
            key={ingredient.id}
            daysUntilOutOfStock={ingredient.daysUntilOutOfStock}
            averageDailyUsage={ingredient.averageDailyUsage}
            shortageProbability={ingredient.totalWeight}
            ingredientName={ingredient.ingredientName}
            isLast={index === props.ingredientTemplates.length - 1}
          />
        ))}
      </ul>
    </>
  );
};

export default IngredientWasteList;
