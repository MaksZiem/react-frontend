import React from "react";
import Button from "../../../shared/components/FormElements/Button";
import Modal from "../../../shared/components/UIElements/Modal";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { useState } from "react";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import './IngredientCartItem.css';

const IngredientCartItem = (props) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const ingredientSubmitHandler = async (event) => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        "http://localhost:8000/api/ingredients/delete-from-cart",
        "DELETE",
        JSON.stringify({
          ingredientTemplateId: props.id,
        }),
        { "Content-Type": "application/json" }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={ingredientSubmitHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li > 
        {isLoading && <LoadingSpinner asOverlay />}
          <div className="cart-item">
            <span className="item-name">{props.name}</span>
            <span className="item-name">{props.category}</span>
            <span className="item-name">{props.weight}</span>
            <div className="item-action" >
            <button onClick={showDeleteWarningHandler} className="add-to-cart-button">
              Usuń
            </button>
            </div>
          </div>
      </li>
    </>
  );
};

export default IngredientCartItem;
