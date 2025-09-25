import React from 'react';
import Card from '../../../shared/components/UIElements/Card';
import { useNavigate } from 'react-router-dom';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import ErrorModal from '../../../shared/components/UIElements/ErrorModal';
import './DishItem.css';
import Modal from '../../../shared/components/UIElements/Modal';
import Button from '../../../shared/components/FormElements/Button';
import { useState } from 'react';
import { URL } from '../../../shared/consts';

const DishItem = (props) => {
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const ingredientSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(props.tableId)
    try {
      await sendRequest(
        `${URL}/api/waiter/add-to-table`,
        'POST',
        JSON.stringify({
          dishId: props.id,
          tableNumber: props.tableId,
        }),
        { 'Content-Type': 'application/json' }
      );  
      setShowConfirmModal(true);
      props.onAddDish();  
    } catch (err) {
      console.log(err);
    }
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
    navigate(`/tables/${props.tableId}`);
  };

  const buttonClass = props.isAvailable ? 'ingredient-details-button' : 'ingredient-details-button disabled';

  return (
    <>
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
        <p>Pomyślnie dodano danie</p>
      </Modal>
    <li lassName='one-item'>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="ingredient-item__content">
        <div className="ingredient-item__info">
          <div className='dish-item-name'>{props.name}</div>
          <div className='dish-item-price'>{props.price} $</div>
          <div className='dish-item-category'>{props.category}</div>
          <img src={`${URL}/${props.image}`} className='ingredient-image'  alt={props.name} />
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
    </>
  );
};

export default DishItem;
