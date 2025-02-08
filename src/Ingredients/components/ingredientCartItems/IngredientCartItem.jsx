import React from "react";
import Button from "../../../shared/components/FormElements/Button";
import Modal from "../../../shared/components/UIElements/Modal";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { useState } from "react";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import './IngredientCartItem.css';
import { useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
const IngredientCartItem = (props) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

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
        { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
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
        header="Czy na pewno?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              Anuluj
            </Button>
            <Button danger onClick={ingredientSubmitHandler}>
              Usuń
            </Button>
          </>
        }
      >
        <p>
          Czy na pewno chcesz usunąć składnik z koszyka?
        </p>
      </Modal>
      <li className={props.isLast ? "last-ingredient2" : "cart-item-ingredient-fix"}> 
        {isLoading && <LoadingSpinner asOverlay />}       
          <span className="item-name-ingredient">{props.name}</span>
          <span className="item-category">{props.category}</span>
          <span className="item-category">{props.weight}</span>
          <div className="item-action-cart">
            <button onClick={showDeleteWarningHandler} className="ingredient-details-button3">
              Usuń
            </button>
          </div>
      </li>
    </>
  );
};

export default IngredientCartItem;
