import React from "react";
import Button from "../../../shared/components/FormElements/Button";
import Modal from "../../../shared/components/UIElements/Modal";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { useState } from "react";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";

const DishCartItem = (props) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const ingredientSubmitHandler = async (event) => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        "http://localhost:8000/api/waiter/delete-from-table",
        "DELETE",
        JSON.stringify({
          dishId: props.id,
          tableNumber: props.tableId,
        }),
        { "Content-Type": "application/json" }
      );
      props.onDelete(props.id, props.tableId);
    } catch (err) {}
  };

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
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
              Anuluj
            </Button>
            <Button danger onClick={ingredientSubmitHandler}>
              Usuń
            </Button>
          </React.Fragment>
        }
      >
        <p>Czy na pewno chcesz usunąć?</p>
      </Modal>
      <li
        className={props.isLast ? "last-ingredient2" : "cart-item-ingredient"}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        <span className="item-name-ingredient">{props.name}</span>
        <span className="item-category">{props.price}</span>
        <span className="item-category">{props.quantity}</span>
        <div className="item-action">
          <button
            onClick={showDeleteWarningHandler}
            className="ingredient-details-button2"
          >
            Usuń
          </button>
        </div>
      </li>
    </>
  );
};

export default DishCartItem;
