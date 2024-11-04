import React from 'react';
import Card from '../../../shared/components/UIElements/Card';
import { useNavigate } from 'react-router-dom';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import ErrorModal from '../../../shared/components/UIElements/ErrorModal';
import './DishItem.css';

const DishItem = (props) => {
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const ingredientSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        'http://localhost:8000/api/waiter/add-to-table',
        'POST',
        JSON.stringify({
          dishId: props.id,
          tableNumber: props.tableId,
        }),
        { 'Content-Type': 'application/json' }
      );
      
      // Po dodaniu dania do koszyka, wywołaj props.onAddDish, aby odświeżyć koszyk
      props.onAddDish();  
    } catch (err) {
      console.log(err);
    }
  };

  const buttonClass = props.isAvailable ? 'ingredient-details-button' : 'ingredient-details-button disabled';

  return (
    <li lassName='one-item'>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="ingredient-item__content">
        <div className="ingredient-item__info">
          <h2>{props.name}</h2>
          <h3>{props.price} $</h3>
          <h3>{props.isAvailable}</h3>
          <img src={`http://localhost:8000/${props.image}`} className='ingredient-image'  alt={props.name} />
        </div>
        <div className="ingredient-item__actions">
          <form onSubmit={ingredientSubmitHandler}>
            <input type="hidden" name="ingredientTemplateId" value={props.id}></input>
            <button type="submit" className={buttonClass} disabled={!props.isAvailable}>
              Dodaj
            </button>
          </form>
        </div>
      </Card>
    </li>
  );
};

export default DishItem;
