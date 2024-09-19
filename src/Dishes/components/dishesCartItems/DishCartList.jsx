import React from 'react'
import { useHttpClient } from '../../../shared/hooks/http-hook';
import DishCartItem from './DishCartItem';
import ErrorModal from '../../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner';

const DishCartList = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const tableId = props.tableId
  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        "http://localhost:5000/api/dishes/add-order",
        "POST",
        JSON.stringify({
          tableNumber: props.tableId,
          orderDate: ''
        }),
        { "Content-Type": "application/json" }
      );
      props.onAddDish();
    } catch (err) {}
  };

  if (props.cartItems.length === 0) {
    return (
      <div className="no-dishs">
        <h1 className="text">Brak wybranych składników</h1>
      </div>
    );
  }
  return (
    <>
    
      <ErrorModal error={error} onClear={clearError} />
      <h1 className="text">Stwórz zamówienie</h1>
      <div className="place-list-form-placeholder">
        <div className="cart-item">
          <span className="item-name">nazwa</span>
          <span className="item-weight">cena</span>
          <span className='item-weight'>ilość</span>
          <span className='item-actions' >akcje</span>
        </div>
      </div>
      <ul className="place-list-form">
        {props.cartItems.map((dish) => (
          <DishCartItem
            key={dish.dishId.id}
            id={dish.dishId.id}
            name={dish.dishId.name}
            price={dish.dishId.price}
            quantity={dish.quantity}
            onDelete={props.onDelete}
            tableId={props.tableId}
          />
        ))}
      </ul>
      
        {isLoading && <LoadingSpinner asOverlay />}
        
        <div className='text2'>
        <button onClick={placeSubmitHandler} className="submit-button">
          Dodaj
        </button>
        </div>
      <h1 className="text2">Wybierz dania</h1>
      
      
    </>
  )
}

export default DishCartList
