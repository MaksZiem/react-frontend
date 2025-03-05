import React from "react";
import IngredientList from "../components/IngredientList";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { URL } from "../../../shared/consts";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import Navbar from "../../components/Navbar";
import IngredientWasteList from "../components/IngredientWasteList";

const IngredientStatistics = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [LoadedIngredientsTamplates, setLoadedIngredientsTemplates] =
    useState();
  const [topIngredients, setTopIngredients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("wszystkie");
  const [ingredientsByCategory, setIngredientsByCategory] = useState({});
  const [inputName, setInputName] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await sendRequest(
          `${URL}/api/config/ingredient-categories`,
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
  }, []);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const responseniedobor = await sendRequest(
          `${URL}/api/statistics/ingredients/deficiency`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        setTopIngredients(responseniedobor);
        console.log(responseniedobor)

        const responseData = await sendRequest(
          `${URL}/api/ingredients`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );
        setLoadedIngredientsTemplates(responseData.ingredientTemplates);

        console.log(auth.userId);
      } catch (error) {}
    };
    fetchDishes();
  }, [sendRequest]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const responseData = await sendRequest(
          `${URL}/api/ingredients?name=${inputName}&category=${selectedCategory}`,
          "GET",
          null,
          {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          }
        );
        setIngredientsByCategory(responseData.ingredientsByCategory);
        // setLoadedCartItems(responseData.cartIngredients);
      } catch (error) {}
    };
    fetchIngredients();
    // console.log(loadedCartItems)
  }, [sendRequest, selectedCategory, inputName, auth.token]);

  const categoryChangeHandler = (event) => {
    setSelectedCategory(event.target.value);
  };

  const nameChangeHandler = (event) => {
    setInputName(event.target.value);
  };

  const handleInredientDetails = (dishId) => {
    console.log("dishId: " + dishId);
    navigate(`/statistics/dishes/dish`, {
      state: { dishId: dishId },
    });
  };

  const filterIngredientsHandler = async (event) => {
    event.preventDefault(); // Prevents page refresh

    try {
      const responseData = await sendRequest(
        `${URL}/api/ingredients?name=${inputName}&category=${selectedCategory}`,
        "GET"
      );
      setLoadedIngredientsTemplates(responseData.ingredientTemplates); // Update with filtered data
    } catch (err) {}
  };

  return (
    <>
      <div className="container-statistics">
        <Navbar />
        <div className="statistics">
          <h2 className="text4">Najwieksze pradopodobieństwo niedoboru</h2>
          {!isLoading && topIngredients.length > 0 && (
            <IngredientWasteList ingredientTemplates={topIngredients} />
          )}

          <h1 className="text3">Składniki</h1>
          <div className="search-container">
            <form className="search-forms" onSubmit={filterIngredientsHandler}>
             
              <div className="select-category">
                <label htmlFor="name">Podaj nazwe:</label>
                <input
                  className="select"
                  type="text"
                  id="name"
                  value={inputName}
                  onChange={nameChangeHandler}
                />
              </div>
              <div className="select-category">
                <label htmlFor="category">Wybierz kategorie:</label>
                <select
                  className="select"
                  id="category"
                  value={selectedCategory}
                  onChange={categoryChangeHandler}
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>

          {!isLoading && ingredientsByCategory && (
            <div>
              {Object.keys(ingredientsByCategory).map((category) => (
                <div key={category} className="category-section">
                  <h2 className="text4">{category}</h2>
                  <IngredientList
                    ingredientTemplates={ingredientsByCategory[category]}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default IngredientStatistics;
