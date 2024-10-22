import React from "react";
import Button from "../../../shared/components/FormElements/Button";
import IngredientCartItem from "./IngredientCartItem";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { useForm } from "../../../shared/hooks/form-hook";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import { VALIDATOR_REQUIRE } from "../../../shared/util/validators";
import Input from "../../../shared/components/FormElements/Input";
import "./IngredientCartList.css";

const IngredientCartList = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        "http://localhost:8000/api/ingredients/add-dish",
        "POST",
        JSON.stringify({
          name: formState.inputs.name.value,
          price: formState.inputs.price.value,
        }),
        { "Content-Type": "application/json" }
      );
      props.onAddDish();
    } catch (err) {}
  };

  if (props.cartItems.length === 0) {
    return (
      <div className="no-ingredients">
        <h1 className="text">Brak wybranych składników</h1>
      </div>
    );
  }

  return (
    <>
    
      <ErrorModal error={error} onClear={clearError} />
      <h1 className="text">Wybrane składniki</h1>
      <div className="place-list-form-placeholder">
        <div className="cart-item">
          <span className="item-name">nazwa</span>
          <span className="item-category">kategoria</span>
          <span className="item-weight">ilość</span>
          <span className="item-action">akcje</span>
        </div>
      </div>
      <ul className="place-list-form">
        {props.cartItems.map((ingredient) => (
          <IngredientCartItem
            key={ingredient.ingredientTemplateId.id}
            id={ingredient.ingredientTemplateId.id}
            name={ingredient.ingredientTemplateId.name}
            category={ingredient.ingredientTemplateId.category}
            weight={ingredient.weight}
            onDelete={props.onDelete}
          />
        ))}
      </ul>
      <h1 className="text2">Stwórz danie</h1>
      <form className="add-dish-forms-container" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="add-dish-forms">
        <Input
        
          id="name"
          element="input"
          type="text"
          label="name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
        />
        <Input
        
          id="price"
          element="input"
          label="price"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid price"
          onInput={inputHandler}
        />
        <button type="submit" className="submit-button" disabled={!formState.isValid}>
          Dodaj
        </button>
        </div>
      </form>
      
    </>
  );
};

export default IngredientCartList;
