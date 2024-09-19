import React, { useEffect, useState } from 'react'
import DishList from '../components/dishesItems/DishList'
import DishCartList from '../components/dishesCartItems/DishCartList'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
const Dishes = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [LoadedDishesTamplates, setLoadedDishesTemplates] =
    useState();
  const [loadedCartItems, setLoadedCartItems] = useState();
  const { tableId } = useParams();
  const navigate = useNavigate();

    useEffect(() => {
        const fetchDishes = async () => {

            try {
                const responseData = await sendRequest('http://localhost:5000/api/dishes')
                setLoadedDishesTemplates(responseData.dishes);
                setLoadedCartItems(responseData.cartDishes);
            } catch (error) {
            }

        }
        fetchDishes()
    }, [sendRequest])

    const cartItemsDeletedHandler = (deletedIngredientId, tableId) => {
        setLoadedCartItems((prevItems) =>
          prevItems.filter(
            (item) => item.dishId._id !== deletedIngredientId
          )
        );
        navigate(`/table-details/${tableId}`);
      };

    const addOrderHandler = () => {
        setLoadedCartItems([])
        navigate(`/table-details/${tableId}`);
    }

      


    return (
        <>
            <h1>{tableId}</h1>
            {/* <h2>{tableNumber}</h2> */}
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className='center'>
                    <LoadingSpinner />
                </div>)}
            {!isLoading && LoadedDishesTamplates && <DishCartList cartItems={loadedCartItems} tableId={tableId} onDelete={cartItemsDeletedHandler} onAddDish={addOrderHandler}/>}
            {!isLoading && LoadedDishesTamplates && <DishList items={LoadedDishesTamplates} tableId={tableId}/>}
        </>
    )
}

export default Dishes;
