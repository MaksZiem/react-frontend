import React from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import DishCartItem from "./DishCartItem";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { useNavigate } from "react-router-dom";

const DishCartList = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        "http://localhost:8000/api/waiter/add-order",
        "POST",
        JSON.stringify({
          tableNumber: props.tableId,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      props.onAddOrder();
      props.onAddDish();
    } catch (err) {}
  };

  if (props.cartItems.length === 0) {
    return (
      <div className="no-dishs">
        <h1 className="text">Brak wybranych dań</h1>
      </div>
    );
  }
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <div className="text-big">Wybrane dania:</div>
      <div className="place-list-form-placeholder-ingredient">
        <div className="ingredients-list-desc">
          <span className="item-name-ingredient">nazwa</span>
          <span className="item-weight">cena</span>
          <span className="item-weight">ilość</span>
          <span className="item-action">akcje</span>
        </div>
      </div>
      <ul className="place-list-form-ingredient">
        {props.cartItems.map((dish, index) => (
          <DishCartItem
            key={dish.dishId.id}
            id={dish.dishId.id}
            name={dish.dishId.name}
            price={dish.dishId.price}
            quantity={dish.quantity}
            onDelete={props.onDelete}
            tableId={props.tableId}
            isLast={index === props.cartItems.length - 1}
          />
        ))}
      </ul>

      {isLoading && <LoadingSpinner asOverlay />}

      <div className="text-margin">
        <button onClick={placeSubmitHandler} className="btn-white-submit">
          Dodaj
        </button>
      </div>
      <h1 className="text2">Wybierz dania</h1>
    </>
  );
};

export default DishCartList;
