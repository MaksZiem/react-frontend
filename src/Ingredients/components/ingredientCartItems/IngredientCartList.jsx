import React from "react";
import Button from "../../../shared/components/FormElements/Button";
import IngredientCartItem from "./IngredientCartItem";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { useForm } from "../../../shared/hooks/form-hook";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import { VALIDATOR_REQUIRE } from "../../../shared/util/validators";
import Input from "../../../shared/components/FormElements/Input";
import "./IngredientCartList.css";
import { useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import ImageUpload from "../../../shared/components/FormElements/ImageUpload";
import Card from "../../../shared/components/UIElements/Card";
import { useEffect } from "react";
import { useState } from "react";
import { URL } from "../../../shared/consts";

const IngredientCartList = (props) => {
  const auth = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
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
        value: "",
        isValid: false,
      },
      category: {
        value: "warzywo",
        isValid: true,
      },
    },
    false
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await sendRequest(
          `${URL}/api/config/dish-categories`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(response.categories);
        setCategories(response.categories);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [sendRequest]);

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("price", formState.inputs.price.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("category", formState.inputs.category.value)
      console.log(formData);
      await sendRequest(
        `${URL}/api/ingredients/add-dish`,
        "POST",
        formData,
        { Authorization: "Bearer " + auth.token }
      );
      console.log(formData);
      props.onAddDish();
    } catch (err) {}
  };

  if (props.cartItems.length > 0) {
    return (
      <>
        <ErrorModal error={error} onClear={clearError} />
        <h1 className="text">Wybrane produkty</h1>
        <div className="place-list-form-placeholder-ingredient">
          <div className="ingredients-list-desc">
            <span className="item-name-ingredient">nazwa</span>
            <span className="item-category">kategoria</span>
            <span className="item-weight">ilość</span>
            <span className="item-action">akcje</span>
          </div>
        </div>
        <ul className="place-list-form-ingredient">
          {props.cartItems.map((ingredient, index) => (
            <IngredientCartItem
              key={ingredient.ingredientTemplateId.id}
              id={ingredient.ingredientTemplateId.id}
              name={ingredient.ingredientTemplateId.name}
              category={ingredient.ingredientTemplateId.category}
              weight={ingredient.weight}
              onDelete={props.onDelete}
              isLast={index === props.cartItems.length - 1} 
            />
          ))}
        </ul>

        <Card className="ingredients-container">
          <h2 className="text">Stwórz danie</h2>
          <hr />
          <form
            onSubmit={placeSubmitHandler}
          >
            <Input
              id="name"
              element="input"
              type="text"
              label="Nazwa"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid name."
              onInput={inputHandler}
            />

            <Input
              id="price"
              label="Cena"
              element="input"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid price"
              onInput={inputHandler}
            />

            <div className="form-control">
              <label htmlFor="category">Kategoria</label>
              <select
                id="category"
                onChange={(e) => inputHandler("category", e.target.value, true)}
                value={formState.inputs.category.value}
                className="select-dropdown"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="ingredient-label">Zdjęcie:</span>
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              onErrorText="Dodaj zdjecie"
            />
            <div className="text">
              <Button type="submit" disabled={!formState.isValid}>
                Dodaj
              </Button>
            </div>
          </form>
        </Card>
      </>
    );
  }
};

export default IngredientCartList;
