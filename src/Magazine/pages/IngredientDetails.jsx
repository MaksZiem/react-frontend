import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Button from "../../shared/components/FormElements/Button";
import "./IngredientDetails.css";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import Modal from "../../shared/components/UIElements/Modal";
import { formatDate } from "../../shared/util/formatDate";
import { AuthContext } from "../../shared/context/auth-context";
const IngredientDetails = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [ingredients, setIngredients] = useState([]);
  const location = useLocation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null)
  const { name, category } = location.state || {};
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: name,
    category: category,
    expirationDate: new Date().toISOString().split("T")[0],
    weight: "",
    price: "",
  });

  const convertDateToInputFormat = (dateString) => {
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`; 
  };
  

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/magazine/${name}`
        );
        setIngredients(responseData.ingredients);
        if (responseData.predictedExpirationDate) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            name: name,
            category: category,
            expirationDate: convertDateToInputFormat(responseData.predictedExpirationDate),
          }));
        }
      } catch (err) {}
    };
    fetchIngredients();
  }, [sendRequest, name, category]);
  

  const inputChangeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const showDeleteWarningHandler = (id) => {
    setSelectedId(id)
    setShowDeleteModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
    setShowDeleteModal(false)
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
      setShowConfirmModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  const ingredientDeleteHandler = async (id) => {
    
    try {
      await sendRequest(
        "http://localhost:8000/api/magazine/delete-ingredient",
        "POST",
        JSON.stringify({
          ingredientId: id,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      setIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.id !== id)
      );
    } catch (err) {
      console.log(err);
    }
    setShowDeleteModal(false);
  };

  const isExpired = (expirationDate) => {
    return new Date(expirationDate) < new Date();
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
        <p>Pomyślnie dodano składnik</p>
      </Modal>
      <Modal
        show={showDeleteModal}
        onCancel={cancelDeleteHandler}
        header="Czy na pewno?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <button className={'modal-button-accept'} onClick={cancelDeleteHandler}>
              Anuluj
            </button>
            <button className={'modal-button-decline'}onClick={() => ingredientDeleteHandler(selectedId)}>
              Usuń
            </button>
          </React.Fragment>
        }
      >
        <p>Czy na pewno chcesz usunąc składnik?</p>
      </Modal>
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && ingredients.length === 0 && (
        <div className="text-big">Brak składników do wyświetlenia</div>
      )}

      
      {!isLoading && ingredients.length > 0 && (
        <>
          <h1 className="text">Ilość wybranego składnika</h1>
          <div className="place-list-form-placeholder-ingredient">
            <div className="ingredients-list-desc">
              <span className="item-name-ingredient">nazwa</span>
              <span className="item-category">kategoria</span>
              <span className="item-category">ilość</span>
              <span className="item-category">cena/ilość</span>
              <span className="item-category">data waności</span>
              <span className="item-category">akcje</span>
            </div>
          </div>
          <ul className="place-list-form-ingredient">
            {ingredients.map((ingredient, index) => (
              <li
                key={ingredient.id}
                className={`ingredient-item-ingredient ${
                  index === ingredients.length - 1 ? "last-ingredient" : ""
                } ${
                  isExpired(ingredient.expirationDate)
                    ? "expired-ingredient"
                    : ""
                }`}
              >
                <span className="item-name-ingredient">{ingredient.name}</span>
                <span className="item-category">{ingredient.category}</span>
                <span className="item-category">{ingredient.weight}</span>
                <span className="item-category">{ingredient.priceRatio.toFixed(2)}</span>
                <span className="item-category">
                  {ingredient.expirationDate}
                </span>
                <form action="/api/ingredients/weight-checkout">
                  <input type="hidden" name="ingredientTemplateId"></input>
                  <button
                    type="button"
                    className="ingredient-details-button3"
                    onClick={() => showDeleteWarningHandler(ingredient.id)}
                  >
                    usun
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="text-margin-50">
        <div className="text-big">Dodaj nową ilość do magazynu</div>
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
              value={formData.expirationDate || ""} 
              onChange={inputChangeHandler}
              required
            />
          </div>
          <div className="select2-container">
            <label htmlFor="weight">Ilość (g)</label>
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
            <button type="submit" className="btn-white-submit">
              Dodaj składnik
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default IngredientDetails;
