import React, { useEffect, useState, useContext } from "react";
import IngredientList from "../components/ingredientTemplate/IngredientList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import IngredientCartList from "../components/ingredientCartItems/IngredientCartList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../src/shared/context/auth-context";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import "./Ingredients.css";

const Ingredients = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [ingredientsByCategory, setIngredientsByCategory] = useState({});
  const [loadedCartItems, setLoadedCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("wszystkie");
  const [categories, setCategories] = useState([]);
  const [inputName, setInputName] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/ingredients?name=${inputName}&category=${selectedCategory}`,
          "GET",
          null,
          {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          }
        );
        setIngredientsByCategory(responseData.ingredientsByCategory);
        setLoadedCartItems(responseData.cartIngredients);
      } catch (error) {}
    };
    fetchIngredients();
  }, [sendRequest, selectedCategory, inputName, auth.token]);


  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
    navigate(`/ingredients-dashboard`);
  };

  const categoryChangeHandler = (event) => {
    setSelectedCategory(event.target.value);
  };

  const nameChangeHandler = (event) => {
    setInputName(event.target.value);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:8000/api/config/ingredient-categories",
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
    setShowConfirmModal(true);
    navigate("/ingredients-dashboard");
  };

  return (
    <>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Aktualizacja"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button onClick={cancelDeleteHandler}>Ok</Button>
          </React.Fragment>
        }
      >
        <p>Pomyślnie dodano danie</p>
      </Modal>
      <ErrorModal error={error} onClear={clearError} />
      <IngredientCartList
        cartItems={loadedCartItems}
        onDelete={cartItemsDeletedHandler}
        onAddDish={addDishHandler}
      />

      <h1 className="text3">Produkty</h1>
      <div className="search-container">
        <form className="search-forms">
          <div className="select-category">
            <label htmlFor="name">Nazwa:</label>
            <input
              className="select"
              type="text"
              id="name"
              value={inputName}
              onChange={nameChangeHandler}
            />
          </div>
          <div className="select-category">
            <label htmlFor="category">Kategoria:</label>
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

      {/* {ingredientsByCategory && ( */}
      <div className="ingredient-search-container">
        {Object.keys(ingredientsByCategory).map((category) => (
          <div key={category} className="category-section">
            <h2 className="text4">{category}</h2>
            <IngredientList
              ingredientTemplates={ingredientsByCategory[category]}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Ingredients;
