import React, { useEffect, useState } from 'react';
import DishList from '../components/dishesItems/DishList';
import DishCartList from '../components/dishesCartItems/DishCartList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Dishes = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [LoadedDishesTemplates, setLoadedDishesTemplates] = useState();
  const [loadedCartItems, setLoadedCartItems] = useState();
  const { tableId } = useParams();
  const navigate = useNavigate();

  const fetchTableCart = async () => {
    try {
      const responseData = await sendRequest(`http://localhost:8000/api/waiter/table-cart/${tableId}`);
      setLoadedDishesTemplates(responseData.dishes);
      setLoadedCartItems(responseData.cartDishes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTableCart();
  }, [sendRequest, tableId]);

  const cartItemsDeletedHandler = (deletedIngredientId) => {
    setLoadedCartItems((prevItems) =>
      prevItems.filter((item) => item.dishId._id !== deletedIngredientId)
    );
    navigate(`/table-details/${tableId}`);
  };

  const updateCartHandler = () => {
    
    console.log('added')
    fetchTableCart();
  };

  return (
    <>
    <div className='center'>
      <h2>Numer stolika: {tableId}</h2>
    </div>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && LoadedDishesTemplates && (
        <DishCartList
          cartItems={loadedCartItems}
          tableId={tableId}
          onDelete={cartItemsDeletedHandler}
          onAddDish={updateCartHandler}
        />
      )}
      {!isLoading && LoadedDishesTemplates && (
        <DishList items={LoadedDishesTemplates} tableId={tableId} onAddDish={updateCartHandler} />
      )}
    </>
  );
};

export default Dishes;
