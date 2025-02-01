import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Navbar from "../componens/Navbar";
import "../componens/List.css";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";

const DishCategoryConfig = () => {
  const { sendRequest, isLoading, error } = useHttpClient();
  const auth = useContext(AuthContext);
  const [ingredientCategories, setIngredientCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null); // Przechowuje kategorię w edycji
  const [newCategoryName, setNewCategoryName] = useState(""); // Nowa nazwa kategorii
  const [addingCategory, setAddingCategory] = useState(false); // Czy dodajemy nową kategorię
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Pobierz kategorie składników
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/config/dish-categories?page=${currentPage}&limit=${itemsPerPage}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setIngredientCategories(responseData.categories);
        setTotalPages(responseData.pages);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [sendRequest, auth.token, currentPage, itemsPerPage]);

  // Dodaj nową kategorię
  const saveNewCategoryHandler = async () => {
    try {
      const newCategory = await sendRequest(
        "http://localhost:8000/api/config/dish-categories",
        "POST",
        JSON.stringify({ name: newCategoryName }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setIngredientCategories((prevCategories) => [
        ...prevCategories,
        newCategory.category,
      ]);
      setShowConfirmModal(true);
      setAddingCategory(false);
      setNewCategoryName("");
    } catch (err) {
      console.error(err);
    }
  };

  // Usuń kategorię
  const deleteCategoryHandler = async (id) => {
    try {
      await sendRequest(
        `http://localhost:8000/api/config/dish-categories/${id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      setIngredientCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== id)
      );
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Rozpocznij edycję kategorii
  const startEditHandler = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name); // Ustaw obecną nazwę jako początkową wartość
  };

  // Anuluj edycję
  const cancelEditHandler = () => {
    setEditingCategory(null);
    setNewCategoryName("");
  };

  // Zapisz zmiany w nazwie kategorii
  const saveEditHandler = async () => {
    try {
      const updatedCategory = await sendRequest(
        `http://localhost:8000/api/config/dish-categories/${editingCategory._id}`,
        "PUT",
        JSON.stringify({ name: newCategoryName }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      setIngredientCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === editingCategory._id
            ? { ...category, name: updatedCategory.category.name }
            : category
        )
      );
      setShowConfirmModal(true);
      setEditingCategory(null);
      setNewCategoryName("");
    } catch (err) {
      console.error(err);
    }
  };

  const showDeleteWarningHandler = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
    setShowDeleteModal(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Resetuj na pierwszą stronę
  };

  return (
    <div>
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
              onClick={() => deleteCategoryHandler(selectedId)}
            >
              Usuń
            </button>
          </React.Fragment>
        }
      >
        <p>Czy na pewno chcesz usunąc składnik?</p>
      </Modal>

      <div className="container-statistics">
        <Navbar />
        <div className="statistics">
          <h1 className="text">Kategorie dań</h1>
          <div className="dish-config-list-form">
            {addingCategory ? (
              <div className="add-container">
                <div>
                  <input
                    className="config-input-add"
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nazwa Nowej Kategorii"
                  />
                </div>
                <div>
                  <button
                    onClick={saveNewCategoryHandler}
                    disabled={isLoading}
                    className="btn-white-submit-config2"
                  >
                    Zapisz
                  </button>
                  <button
                    onClick={() => setAddingCategory(false)}
                    disabled={isLoading}
                    className="btn-white-submit-config1"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingCategory(true)}
                className="btn-white-submit-config"
              >
                Dodaj Nową Kategorię
              </button>
            )}

            <ul className="dish-config-list-form">
              {ingredientCategories.map((category) => (
                <li key={category._id} className="cart-item-ingredient">
                  {editingCategory && editingCategory._id === category._id ? (
                    <>
                      <div className="item-column">
                        <input
                          className="config-input"
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                      </div>
                      <div className="item-column">
                        <button
                          onClick={saveEditHandler}
                          disabled={isLoading}
                          className="ingredient-details-button8"
                        >
                          Zapisz
                        </button>
                      </div>
                      <div className="item-column">
                        <button
                          onClick={cancelEditHandler}
                          disabled={isLoading}
                          className="ingredient-details-button8"
                        >
                          Anuluj
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="item-column">
                        <span>{category.name}</span>
                      </div>
                      <div className="item-column">
                        <button
                          onClick={() => startEditHandler(category)}
                          className="ingredient-details-button8"
                        >
                          Edytuj
                        </button>
                      </div>
                      <div className="item-column">
                        <button
                          onClick={() => showDeleteWarningHandler(category._id)}
                          disabled={isLoading}
                          className="ingredient-details-button9"
                        >
                          Usuń
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-white-pagination-config"
              >
                Poprzednia
              </button>
              <span className="pagination-text">
                Strona {currentPage} z {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-white-pagination-config"
              >
                Następna
              </button>
            </div>

            <div className="items-per-page">
              <span className="pagination-text">Elementy na stronę: </span>
              {[5, 10, 15].map((limit) => (
                <button
                  key={limit}
                  onClick={() => handleItemsPerPageChange(limit)}
                  className={itemsPerPage === limit ? "active" : ""}
                >
                  {limit}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishCategoryConfig;
