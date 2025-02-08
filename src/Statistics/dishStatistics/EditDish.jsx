import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";
import IngredientList from "../components/ingredientTemplate/IngredientList";
import Navbar from "../components/Navbar";
import Card from "../../shared/components/UIElements/Card";
import "./EditDish.css";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";

const EditDish = () => {
  const { dishId } = useParams();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [dish, setDish] = useState(null);
  const auth = useContext(AuthContext);
  const [loadedCartItems, setLoadedCartItems] = useState([]);
  const [ingredientsByCategory, setIngredientsByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("wszystkie");
  const [dishIngredients, setDishIngredients] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inputName, setInputName] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: { value: "", isValid: false },
      price: { value: "", isValid: false },
      image: { value: null, isValid: false },
      isBlocked: { value: false, isValid: true },
    },
    false
  );

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
      } catch (error) {
      }
    };
    fetchIngredients();
  }, [sendRequest, selectedCategory, inputName, auth.token]);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/statistics/dishes/${dishId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );


        setFormData(
          {
            name: { value: responseData.name, isValid: true },
            price: { value: responseData.price, isValid: true },
            image: { value: responseData.image || null, isValid: true },
            isBlocked: { value: responseData.isBlocked, isValid: true },
          },
          true
        );
        setDishIngredients(responseData.ingredientTemplates);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDish();
  }, [dishId]);

  // // Obsługa zmiany pól formularza
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };


  const handleDeleteIngredient = async (ingredientId) => {
    console.log('usuwanie', ingredientId);
    try {
      // Wyślij żądanie DELETE do API
      await sendRequest(
        `http://localhost:8000/api/statistics/dishes/delete-ingredient/${dishId}/${ingredientId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
  
      // Usuń składnik lokalnie ze stanu dishIngredients
      setDishIngredients((prevIngredients) =>
        prevIngredients.filter(
          (template) => template.ingredient._id.toString() !== ingredientId
        )
      );
      setShowDeleteModal(false)
    } catch (err) {
      console.error("Błąd podczas usuwania składnika:", err);
    }
  };
  

  const categoryChangeHandler = (event) => {
    setSelectedCategory(event.target.value);
  };

  const nameChangeHandler = (event) => {
    setInputName(event.target.value);
  };

  const showDeleteWarningHandler = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
    setShowDeleteModal(false);
  };

  // Obsługa wysłania formularza
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("price", formState.inputs.price.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("isBlocked", formState.inputs.isBlocked.value);
      dishIngredients.forEach((item, index) => {
        formData.append(`ingredientTemplates[${index}][ingredientId]`, item.ingredient._id);
        formData.append(`ingredientTemplates[${index}][weight]`, item.weight);
      });
      
      const responseDishes = await sendRequest(
        `http://localhost:8000/api/statistics/dishes/update/${dishId}`,
        "PUT",
        formData,
        {
          Authorization: "Bearer " + auth.token,
          
        }
      );
      if(selectedId === null) {

        setShowConfirmModal(true);
      }
      console.log( dishIngredients)
      console.log(responseDishes);
    } catch (err) {
      console.error("Błąd aktualizacji dania:", err);
    }
  };

  return (
    <div className="container-statistics">
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
        <p>Operacja przebiegła pomyślnie</p>
      </Modal>
      <Modal
        show={showDeleteModal}
        onCancel={cancelDeleteHandler}
        header="Czy na pewno?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <button
              className={"modal-button-accept"}
              onClick={cancelDeleteHandler}
            >
              Anuluj
            </button>
            <button
              className={"modal-button-decline"}
              onClick={() => handleDeleteIngredient(selectedId)}
            >
              Usuń
            </button>
          </React.Fragment>
        }
      >
        <p>Czy na pewno chcesz usunąc składnik?</p>
      </Modal>
      <Navbar />
      <div className="statistics">
        <div className="dish-info">
          <h1>Edycja dania</h1>
          <Card className="edit-dish">            
            {formState.inputs.name.value && (
              <form onSubmit={handleSubmit}>
                <div>
                <div className="box-input">
                  <label>
                    <span className="ingredient-label">Nazwa:</span>
                    <div className="input-container">
                      <Input
                        id="name"
                        element="input"
                        type="text"                      
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Wprowadź poprawną nazwę."
                        onInput={inputHandler}
                        // value={formState.inputs.name.value}
                        initialValue={formState.inputs.name.value || ""}
                        initialValid={formState.inputs.name.isValid}
                      />
                    </div>
                  </label>
                  </div>
                </div>
                <div>
                  <div className="box-input">
                    <label>
                      <span className="ingredient-label">Cena:</span>
                      <div className="input-container">
                        <Input
                          id="price"
                          element="input"
                          type="number"
                          validators={[VALIDATOR_REQUIRE()]}
                          errorText="Wprowadź poprawną cenę."
                          onInput={inputHandler}
                          initialValue={formState.inputs.price.value}
                          initialValid={formState.inputs.price.isValid}
                        />
                      </div>
                    </label>
                  </div>
                </div>
                <div>
                <span className="ingredient-label">Zdjęcie:</span>
                  <ImageUpload
                    center
                    id="image"
                    onInput={inputHandler}
                    initialPreviewUrl={
                      formState.inputs.image.value
                        ? `http://localhost:8000/${formState.inputs.image.value}`
                        : ""
                    }
                    onErrorText="Dodaj zdjęcie"
                  />
                </div>
                <div>
                <div className="box-input">
                  <label>
                    <span className="ingredient-label">Zablokowane? </span>
                    <input
                      className="check-is-available "
                      type="checkbox"
                      checked={formState.inputs.isBlocked.value}
                      onChange={(e) =>
                        inputHandler("isBlocked", e.target.checked, true)
                      }
                    />
                  </label>
                  </div>
                </div>
                <div>
                  <h2>Składniki</h2>
                  {dishIngredients.map((ingredient, index) => (
                    <div key={index} className="dish-row">
                      <div className="dish-row-name">
                        {ingredient.ingredient.name}
                      </div>
                      <div className="dish-row-price">Ilość:</div>
                      <div className="dish-row-price">
                        <input
                          type="number"
                          value={ingredient.weight}
                          onChange={(e) => {
                            const updatedIngredients = [...dishIngredients];
                            updatedIngredients[index].weight = e.target.value;
                            setDishIngredients(updatedIngredients);
                          }}
                        />
                      </div>
                      <div className="dish-row-price-delete">
                      <button
                          onClick={() => showDeleteWarningHandler(ingredient.ingredient._id)}
                          className="ingredient-details-button9"
                        >
                          Usuń
                        </button>
                        </div>
                    </div>
                    
                  ))}
                </div>
                <button type="submit" className="submit-button-gray">
                  Zaktualizuj danie
                </button>
              </form>
            )}
          </Card>
          <h2 className="text3">Dodaj skladnik</h2>
          <div className="search-container">
            <form className="search-forms">
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
                  <option value="all">All</option>
                  <option value="fruit">Fruit</option>
                  <option value="meat">Meat</option>
                  <option value="vegetable">Vegetable</option>
                </select>
              </div>            
            </form>
          </div>

          {ingredientsByCategory && (
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
    </div>
  );
};

export default EditDish;
