import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Button from "../../shared/components/FormElements/Button";
import "./IngredientDetails.css";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
const IngredientDetails = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [ingredients, setIngredients] = useState([]);
  const location = useLocation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { name, category } = location.state || {};
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: name,
    category: category,
    expirationDate: "",
    weight: "",
    price: "",
  });

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/magazine/${name}`
        );
        setIngredients(responseData.ingredients);
        if (responseData.ingredients.length > 0) {
          setFormData({
            name: name,
            category: category,
            expirationDate: "",
            weight: "",
            price: "",
          });
        }
      } catch (err) {}
    };
    fetchIngredients();
  }, [sendRequest, name]);

  const inputChangeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      console.log(formData);
      await sendRequest(
        "http://localhost:8000/api/magazine/add-ingredient",
        "POST",
        JSON.stringify({
          name: formData.name,
          category: formData.category,
          expirationDate: formData.expirationDate,
          weight: formData.weight,
          price: formData.price,
        }),
        { "Content-Type": "application/json" }
      );

      const responseData = await sendRequest(
        `http://localhost:8000/api/magazine/${name}`
      );
      setIngredients(responseData.ingredients);
    } catch (err) {
      console.log(err);
    }
  };

  const ingredientTemplateDeleteHandler = async (event) => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        "http://localhost:8000/api/ingredients/delete-ingredient-template",
        "DELETE",
        JSON.stringify({
          ingredientTemplateId: props.id,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
        props.onDelete(props.id);
      
    } catch (err) {}
  };

  return (
    <>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && ingredients.length === 0 && (
        <span>Brak składników do wyświetlenia.</span>
      )}

      {/* Wyświetlanie listy składników */}
      {!isLoading && ingredients.length > 0 && (
        <>
          <h1 className="text">Ilość wybranego składnika</h1>
          <div className="place-list-form-placeholder-ingredient">
            <div className="ingredients-list-desc">
              <span className="item-category">nazwa</span>
              <span className="item-category">kategoria</span>
              <span className="item-category">ilość</span>
              <span className="item-category">data waności</span>
              <span className="item-action">akcje</span>
            </div>
          </div>
          <ul className="place-list-form-ingredient">
            {ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                <div className="cart-item-ingredient">
                  <span className="item-name-ingredient">
                    {ingredient.name}
                  </span>
                  <span className="item-category">{ingredient.category}</span>
                  <span className="item-weight">{ingredient.weight}</span>
                  <span className="item-action">
                    {ingredient.expirationDate}
                  </span>
                  <form action="/api/ingredients/weight-checkout">
                    <input
                      type="hidden"
                      name="ingredientTemplateId"
                      
                    ></input>
                    <button
                      type="button"
                      className="ingredient-details-button2"
                      
                    >
                      usun
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="text2">
        <h3>Dodaj nową ilość do magazynu</h3>
      </div>
      <form className="add-dish-forms-container" onSubmit={submitHandler}>
        <div className="add-dish-forms2">
          <div className="select2-container">
            <label htmlFor="name">Nazwa</label>
            <input
              className="select2"
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={inputChangeHandler}
              required
              disabled
            />
          </div>
          <div className="select2-container">
            <label htmlFor="category">Kategoria</label>
            <input
              className="select2"
              type="text"
              name="category"
              id="category"
              value={category}
              onChange={inputChangeHandler}
              required
              disabled
            />
          </div>
          <div className="select2-container">
            <label htmlFor="expirationDate">Data ważności</label>
            <input
              className="select2"
              type="date"
              name="expirationDate"
              id="expirationDate"
              value={formData.expirationDate}
              onChange={inputChangeHandler}
              required
            />
          </div>
          <div className="select2-container">
            <label htmlFor="weight">Ilość</label>
            <input
              className="select2"
              type="number"
              name="weight"
              id="weight"
              value={formData.weight}
              onChange={inputChangeHandler}
              required
            />
          </div>
          <div className="select2-container">
            <label htmlFor="price">Cena</label>
            <input
              className="select2"
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={inputChangeHandler}
              required
            />
          </div>
          <div className="text2">
            <button type="submit" className="submit-button2">
              Dodaj składnik
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default IngredientDetails;
