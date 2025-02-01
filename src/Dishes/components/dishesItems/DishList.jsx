import React from "react";
import Button from "../../../shared/components/FormElements/Button";
import DishItem from "./DishItem";
import Card from "../../../shared/components/UIElements/Card";
import "./DishList.css";

const DishList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>Nie znaleziono dań</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className="grid-container3">
      {props.items.map((dish) => (
        <DishItem
          key={dish.id}
          id={dish.id}
          category={dish.category}
          name={dish.name}
          image={dish.image || ""}
          price={dish.price}
          isAvailable={dish.isAvailable}
          tableId={props.tableId}
          onAddDish={props.onAddDish}
        />
      ))}
    </ul>
  );
};

export default DishList;
