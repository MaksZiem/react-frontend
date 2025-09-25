import React from "react";
import Card from "../../shared/components/UIElements/Card";
import { useNavigate } from "react-router-dom";
import "./MagazineDashboardItem.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useState, useContext } from "react";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { URL } from "../../shared/consts";


const MagazineDashboardItem = (props) => {
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const auth = useContext(AuthContext);

  const handleButtonClick = () => {
    navigate(`/magazine/${props.name}`, {
      state: {
        name: props.name,
        category: props.category,
        id: props.id,
        image: props.image,
      },
    });
  };

  const ingredientTemplateDeleteHandler = async (event) => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${URL}/api/ingredients/delete-ingredient-template`,
        "DELETE",
        JSON.stringify({
          ingredientTemplateId: props.id,
          ingredientTemplateName: props.name,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      props.onDelete(props.id);
    } catch (err) {
      console.log(err);
    }
  };

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <Modal
        show={showConfirmModal}
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
              onClick={ingredientTemplateDeleteHandler}
            >
              Usuń
            </button>
          </React.Fragment>
        }
      >
        <p>Czy na pewno chcesz usunąc składnik?</p>
      </Modal>
      <li className="one-item">
        {isLoading && <LoadingSpinner asOverlay />}
        <Card className="ingredient-item__content">
          <div className="ingredient-item__info">
            <h2>{props.name}</h2>
            <h3>{props.category}</h3>
            <div className="ingredient-image">
              <img
                src={`${URL}/uploads/images/${props.image}`}
                className="ingredient-image"
                alt={props.name}
              />
            </div>
          </div>
          <div className="ingredient-item__actions">
            <button
              type="button"
              className="ingredient-details-button "
              onClick={handleButtonClick}
            >
              Przejdź do składnika
            </button>
            <button
              type="button"
              className="delete-ingredient-template "
              onClick={showDeleteWarningHandler}
            >
              Usuń składnik
            </button>
          </div>
        </Card>
      </li>
    </>
  );
};

export default MagazineDashboardItem;
