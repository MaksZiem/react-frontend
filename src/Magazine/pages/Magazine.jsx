import React from "react";
import MagazineDashboard from "../components/MagazineDashboard";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MAXLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import './IngredientDetails.css'

const Magazine = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [LoadedIngredientsTamplates, setLoadedIngredientsTemplates] =
    useState();
  const [loadedCartItems, setLoadedCartItems] = useState();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [inputName, setInputName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/ingredients",
          "GET"
        );
        setLoadedIngredientsTemplates(responseData.ingredientTemplates);
        setLoadedCartItems(responseData.cartIngredients);
        console.log(responseData.cartIngredients);
      } catch (error) {}
    };
    fetchDishes();
  }, [sendRequest]);

  const categoryChangeHandler = (event) => {
    setSelectedCategory(event.target.value);
  };

  const nameChangeHandler = (event) => {
    setInputName(event.target.value);
  };


  const cartItemsDeletedHandler = (deletedIngredientId) => {
    setLoadedCartItems((prevItems) =>
      prevItems.filter(
        (item) => item.ingredientTemplateId._id !== deletedIngredientId
      )
    );
    navigate("/ingredients-dashboard");
  };

  const addDishHandler = (deletedIngredientId) => {
    setLoadedCartItems([]);
    navigate("/ingredients-dashboard");
  };

  const filterIngredientsHandler = async (event) => {
    event.preventDefault(); // Prevents page refresh

    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/ingredients?name=${inputName}&category=${selectedCategory}`,
        "GET"
      );
      setLoadedIngredientsTemplates(responseData.ingredientTemplates); // Update with filtered data
    } catch (err) {}
  };

  const addIngredientTemplateHandler = () => {
    navigate("/create-ingredient-template"); // Używamy navigate, aby przejść do odpowiedniej strony
  };


  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <h1 className="text3">Produkty</h1>
      <div className="search-container">
        <form className="search-forms"  onSubmit={filterIngredientsHandler}>
          {/* Add your select input or other fields here */}
          <div className="select-category" >
          <label htmlFor="name">Enter Name:</label>
            <input
            className="select"
              type="text"
              id="name"
              value={inputName}
              onChange={nameChangeHandler}
            />
          </div>
          <div className="select-category">
            <label htmlFor="category">Select Category:</label>
            <select
              className="select"
              id="category"
              value={selectedCategory}
              onChange={categoryChangeHandler}
            >
              <option value="all">All</option>
              <option value="fruit">Fruit</option>
              <option value="vegetable">Vegetable</option>
            </select>
          </div>
          <button type="submit" className="submit-button" >Filter</button>
        </form>
      </div>

      <div className="text2">
        <button onClick={addIngredientTemplateHandler} className="submit-button2">
          Dodaj Składnik
        </button>
      </div>
      
      {!isLoading && LoadedIngredientsTamplates && (
        <MagazineDashboard ingredientTemplates={LoadedIngredientsTamplates} />
      )}
    </>
  );
};

export default Magazine;