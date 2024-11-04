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
import { useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import ImageUpload from "../../../shared/components/FormElements/ImageUpload";

const IngredientCartList = (props) => {
  const auth = useContext(AuthContext)
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
      image: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData()
      formData.append('name', formState.inputs.name.value)
      formData.append('price', formState.inputs.price.value)
      formData.append('image', formState.inputs.image.value)
      await sendRequest(
        "http://localhost:8000/api/ingredients/add-dish",
        "POST",
        formData,
        { Authorization: 'Bearer ' + auth.token } 
      );
      props.onAddDish();
    } catch (err) {
      
    }
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
      <div className="place-list-form-placeholder-ingredient">
        <div className="ingredients-list-desc">
          <span className="item-name-ingredient">nazwa</span>
          <span className="item-category">kategoria</span>
          <span className="item-weight">ilość</span>
          <span className="item-action">akcje</span>
        </div>
      </div>
      <ul className="place-list-form-ingredient">
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
        <ImageUpload center id="image" onInput={inputHandler} onErrorText="Dodaj zdjecie" />
        <div className="text">

        <Button type="submit" disabled={!formState.isValid}>
          Dodaj
        </Button>
        </div>
        </div>
      </form>
      
    </>
  );
};

export default IngredientCartList;
