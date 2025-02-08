import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import Navbar from "../components/Navbar";
import "./DishesStatistics.css";

const DishesStatistics = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [dishes, setDishes] = useState([]);
  const [sortOption, setSortOption] = useState(""); // Przechowuje aktualne kryterium sortowania
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const responseDishes = await sendRequest(
          `http://localhost:8000/api/dishes/?sort=${sortOption}`,
          "GET"
        );
        setDishes(responseDishes.dishes);
      } catch (err) {}
    };
    fetchDishes();
  }, [sendRequest, sortOption]);

  const handleDelete = async (id) => {
    try {
      await sendRequest(
        `http://localhost:8000/api/statistics/dishes/delete-dish/${id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setDishes((prevDishes) => prevDishes.filter((dish) => dish._id !== id));
      setShowConfirmModal(true);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Błąd podczas usuwania dania:", err);
    }
  };

  const handleCookClick = (dishId) => {
    navigate(`/statistics/dishes/dish`, { state: { dishId } });
  };

  const handleEditClick = (dishId) => {
    navigate(`/statistics/dishes/update/${dishId}`);
  };

  const showDeleteWarningHandler = (id) => {
    setShowDeleteModal(true);
    setSelectedId(id);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
    setShowDeleteModal(false);
  };

  const handleSort = (field) => {
    // Zmiana kryterium sortowania
    setSortOption((prevSort) =>
      prevSort === field ? `-${field}` : field // Jeśli już sortujemy po `field`, odwróć kolejność
    );
  };

  return (
    <div>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Aktualizacja"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={cancelDeleteHandler}>Ok</Button>}
      >
        <p>Operacja przebiegła pomyślnie</p>
      </Modal>
      <Modal
        show={showDeleteModal}
        onCancel={cancelDeleteHandler}
        header="Czy napewno?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              Anuluj
            </Button>
            <Button danger onClick={() => handleDelete(selectedId)}>
              Usuń
            </Button>
          </>
        }
      >
        <p>Czy na pewno chcesz usunąć?</p>
      </Modal>
      <div className="container-statistics">
        <Navbar />
        <div className="statistics">
          <h1 className="text">Lista dań</h1>
          <div className="dish-update-list-form-placeholder-ingredient">
            <div className="dish-update-list-desc">        
              <button
                onClick={() => handleSort("name")}
                className="btn-dish-update-name"
              >
                Nazwa
              </button>
              <button
                onClick={() => handleSort("price")}
                className="btn-dish-update-category"
              >
                Cena
              </button>
              <button
                onClick={() => handleSort("isAvailable")}
                className="btn-dish-update-category"
              >
                Dostępność
              </button>
              <span className="dishes-action">Akcje</span>
            </div>
          </div>
          <ul className="dish-update-list-form">
            {dishes.map((dish, index) => (
              <li
                key={dish._id}
                className={
                  index === dishes.length - 1
                    ? "last-ingredient2"
                    : "cart-item-ingredient"
                }
              >
                <span className="dish-update-name">{dish.name}</span>
                <span className="dish-update-category">{dish.price} PLN</span>
                <span className="dish-update-category">
                  {dish.isAvailable ? "Dostępne" : "Niedostępne"}
                </span>
                <div className="dishes-action">
                  <div className="dish-action">
                    <button
                      onClick={() => handleCookClick(dish._id)}
                      className="dish-details-button7"
                    >
                      Statystyki
                    </button>
                  </div>
                  <div className="dish-action">
                    <button
                      onClick={() => handleEditClick(dish._id)}
                      className="dish-details-button7"
                    >
                      Edytuj
                    </button>
                  </div>
                  <div className="dish-action">
                    <button
                      onClick={() => showDeleteWarningHandler(dish._id)}
                      className="dish-details-button7-delete"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DishesStatistics;
