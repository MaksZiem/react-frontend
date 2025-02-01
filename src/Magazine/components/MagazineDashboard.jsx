import React from "react";
import Button from "../../shared/components/FormElements/Button";
import MagazineDashboardItem from "./MagazineDashboardItem";
import Card from "../../shared/components/UIElements/Card";
import "./MagazineDashboard.css";

const MagazineDashboard = (props) => {
  if (props.ingredientTemplates.length === 0) {
    return (
      <div className="place-list center">
        <h2>Nie ma składników dla tej kategorii</h2>
      </div>
    );
  }

  return (
    <ul className="grid-container3">
      {props.ingredientTemplates.map((ingredient) => (
        <MagazineDashboardItem
          key={ingredient.id}
          id={ingredient.id}
          name={ingredient.name}
          category={ingredient.category}
          image={ingredient.image}
          onDelete={props.onDelete}
        />
      ))}
    </ul>
  );
};

export default MagazineDashboard;
