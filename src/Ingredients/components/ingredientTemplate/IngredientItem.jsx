import React from "react";
import Card from "../../../shared/components/UIElements/Card";
import Button from "../../../shared/components/FormElements/Button";
import { useNavigate } from "react-router-dom";
import "./IngredientItem.css";

const IngredientItem = (props) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Navigate to the new route with state containing the ingredient data

    navigate("/weight-checkout", {
      state: {
        name: props.name,
        category: props.category,
        id: props.id,
      },
    });
  };

  return (
    <>
      <li>
        {/* <Card className='place-item__content'> */}
        <div className="cart-item-ingredient">
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
              className="ingredient-details-button2"
              onClick={handleButtonClick}
            >
              Dodaj do koszyka
            </button>
          </form>
          </div>
        </div>
        {/* </Card> */}
      </li>
    </>
  );
};

export default IngredientItem;
