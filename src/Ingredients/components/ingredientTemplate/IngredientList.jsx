import React from "react";
import Button from "../../../shared/components/FormElements/Button";
import IngredientItem from "./IngredientItem";
import Card from "../../../shared/components/UIElements/Card";
import "./IngredientList.css";

const IngredientList = (props) => {
  if (props.ingredientTemplates.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>Nie znaleziono skladników</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="place-list-form-placeholder-ingredient">
        <div className="ingredients-list-desc">
          <span className="item-name-ingredient">nazwa</span>
          <span className="item-category">kategoria</span>
          <span className="item-action">akcje</span>
        </div>
      </div>
      <ul className="place-list-form-ingredient">
        {props.ingredientTemplates.map((ingredient, index) => (
          <IngredientItem
            key={ingredient.id}
            id={ingredient.id}
            name={ingredient.name}
            category={ingredient.category}
            isLast={index === props.ingredientTemplates.length - 1} 
          />
        ))}
      </ul>
    </>
  );
};

export default IngredientList;
