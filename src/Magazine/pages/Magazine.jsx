import React from "react";
import MagazineDashboard from "../components/MagazineDashboard";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import "./IngredientDetails.css";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import "./Magazine.css";
import IngredientItem from "../components/IngredientItem";
import Modal from "../../shared/components/UIElements/Modal";

const Magazine = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [LoadedIngredientsTamplates, setLoadedIngredientsTemplates] = useState(
    []
  );
  const [loadedCartItems, setLoadedCartItems] = useState();
  const [selectedCategory, setSelectedCategory] = useState("wszystkie");
  const [inputName, setInputName] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [expiredIngredients, setExpiredIngredients] = useState([]);
  const [usedIngredients, setUsedIngredients] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await sendRequest(
          'http://localhost:8000/api/config/ingredient-categories',
          'GET',
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(response.categories)
        setCategories(response.categories);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUsedIngredients = async () => {
      console.log('a')
      try {
        const respons2 = await sendRequest(
          "http://localhost:8000/api/statistics/ingredients/bbb",
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setUsedIngredients(respons2.ingredients || []);
        console.log(respons2)
      } catch (err) {
        console.error(err);
      }
    };

    const fetchWastedIngredients = async () => {
      try {
        const respons = await sendRequest(
          "http://localhost:8000/api/statistics/ingredients/aaa",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setExpiredIngredients(respons.ingredients || []);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchMagazineDashboard = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:8000/api/ingredients/magazine",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );
        setLoadedCartItems(responseData.cartIngredients);
        console.log(responseData.cartIngredients);
      } catch (error) {}
    };
    fetchUsedIngredients();
    fetchWastedIngredients();
    fetchMagazineDashboard();
  }, [sendRequest]);

  const categoryChangeHandler = (event) => {
    setSelectedCategory(event.target.value);
  };

  const nameChangeHandler = (event) => {
    setInputName(event.target.value);
  };

  const deleteIngredientTemplateHandler = (deletedIngredientId) => {
    setLoadedIngredientsTemplates((prevItems) => {
      if (Array.isArray(prevItems)) {
        return prevItems.filter((item) => item._id !== deletedIngredientId);
      }

      const updatedTemplates = { ...prevItems };
      for (const category in updatedTemplates) {
        updatedTemplates[category] = updatedTemplates[category].filter(
          (item) => item._id !== deletedIngredientId
        );
      }
      return updatedTemplates;
    });
    setShowConfirmModal(true);
  };

  const filterIngredientsHandler = async (event) => {
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
      setLoadedIngredientsTemplates(responseData.ingredientsByCategory);
    } catch (err) {}
  };

  useEffect(() => {
    filterIngredientsHandler();
  }, [sendRequest, selectedCategory, inputName, auth.token]);

  const addIngredientTemplateHandler = () => {
    navigate("/magazine/create-ingredient-template");
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
    navigate("/magazine");
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
      setUsedIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient._id !== id)
      );
      setExpiredIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
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
        <p>Pomyślnie usunieto składnik</p>
      </Modal>
      <h1 className="text3">Produkty</h1>
      <div className="search-container">
        <form className="search-forms" onSubmit={filterIngredientsHandler}>
          {/* Add your select input or other fields here */}
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

      <div className="text-margin">
        <button
          onClick={addIngredientTemplateHandler}
          className="btn-white-submit"
        >
          Dodaj Składnik
        </button>
      </div>

      <div className="text-big">Przeterminowane Składniki:</div>

      {expiredIngredients.length > 0 ? (
        <>
          <ul className="place-list-form-ingredient">
            <div className="place-list-form-placeholder-ingredient">
              <div className="ingredients-list-desc">
                <span className="item-name-ingredient">nazwa</span>
                <span className="item-category">kategoria</span>
                <span className="item-category">data waznosci</span>
                <span className="item-action">akcje</span>
              </div>
            </div>
            {expiredIngredients.map((ingredient, index) => (
              <IngredientItem
                key={ingredient.id}
                id={ingredient._id}
                name={ingredient.name}
                expirationDate={ingredient.expirationDate}
                category={ingredient.category}
                isLast={index === expiredIngredients.length - 1}
                onDelete={ingredientDeleteHandler}
              />
            ))}
          </ul>
        </>
      ) : (
        <div className="text-bmid">Brak przeterminowanych składników.</div>
      )}

<div className="text-big">Wykorzystane składniki:</div>

{usedIngredients.length > 0 ? (
  <>
    <ul className="place-list-form-ingredient">
      <div className="place-list-form-placeholder-ingredient">
        <div className="ingredients-list-desc">
          <span className="item-name-ingredient">nazwa</span>
          <span className="item-category">kategoria</span>
          <span className="item-category">data waznosci</span>
          <span className="item-action">akcje</span>
        </div>
      </div>
      {usedIngredients.map((ingredient, index) => (
        <IngredientItem
          key={ingredient.id}
          id={ingredient._id}
          name={ingredient.name}
          expirationDate={ingredient.expirationDate}
          category={ingredient.category}
          isLast={index === usedIngredients.length - 1}
          onDelete={ingredientDeleteHandler}
        />
      ))}
    </ul>
  </>
) : (
  <div className="text-bmid">Brak wykorzystanych składników.</div>
)}


      {LoadedIngredientsTamplates &&
        Object.keys(LoadedIngredientsTamplates).map((category) => (
          <div key={category} className="category-section">
            <h2 className="text4">{category}</h2>
            <MagazineDashboard
              ingredientTemplates={LoadedIngredientsTamplates[category]}
              onDelete={deleteIngredientTemplateHandler}
            />
          </div>
        ))}
    </>
  );
};

export default Magazine;
