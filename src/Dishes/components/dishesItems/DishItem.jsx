import React from 'react'

import Card from '../../../shared/components/UIElements/Card';
// import Button from '../../../shared/components/FormElements/Button';
import { useNavigate } from 'react-router-dom';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import ErrorModal from '../../../shared/components/UIElements/ErrorModal';

import './DishItem.css';

const DishItem = (props) => {

  const navigate = useNavigate()
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  console.log(props.isAvailable)

  const ingredientSubmitHandler = async event => {
    event.preventDefault();
    try {
      console.log(props.id)
        await sendRequest(
            'http://localhost:5000/api/dishes/add-to-cart',
            'POST',
            JSON.stringify({
                dishId: props.id,
            }),
            { 'Content-Type': 'application/json' }
        );
        navigate(`/table-details/${props.tableId}`)
    } catch (err) { }
};

const buttonClass = props.isAvailable ? 'add-to-cart-button' : 'add-to-cart-button disabled';


  return (
 <li> <ErrorModal error={error} onClear={clearError} />
      <Card className='place-item__content'>
          <div className='place-item__info'>
          <h2>{props.name}</h2>
          <h3>{props.price} $</h3>
          <h3>{props.isAvailable}</h3>
              {/* {props.isAvailable ? "" : "chwilowo niedostępne"} */}
          </div>
          <div className='place-item__actions'>
              {/* <Button to={`/places/${props.id}`}>Edit</Button> */}
              <form onSubmit={ingredientSubmitHandler}>
              <input type="hidden" name="ingredientTemplateId" value={props.id}></input>
              <button type="submit" className={buttonClass} disabled={!props.isAvailable}>Dodaj </button>
              </form>

          </div>
      </Card>
  </li> 
// </>
  )
}

export default DishItem
