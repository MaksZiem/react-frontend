import React, { useEffect, useState } from "react";
import DishList from "../components/dishesItems/DishList";
import DishCartList from "../components/dishesCartItems/DishCartList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import { URL } from "../../shared/consts";

const Dishes = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [dishesByCategory, setDishesByCategory] = useState();
  const [loadedCartItems, setLoadedCartItems] = useState();
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("wszystkie");
  const [inputName, setInputName] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [orderNote, setOrderNote] = useState("");
  const auth = useContext(AuthContext);
  
  const fetchTableCart = async () => {
    try {
      const responseData = await sendRequest(
        `${URL}/api/waiter/table-cart/${tableId}?name=${inputName}&category=${selectedCategory}`
      );
      console.log(responseData);
      setDishesByCategory(responseData.dishesByCategory);
      console.log(responseData.dishesByCategory);
      setLoadedCartItems(responseData.cartDishes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTableCart();
  }, [sendRequest, inputName, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await sendRequest(
          `${URL}/api/config/dish-categories`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(response.categories);
        setCategories(response.categories);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [sendRequest]);

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
    navigate(`/tables/${props.tableId}`);
  };

  const cartItemsDeletedHandler = async (deletedIngredientId) => {
    setLoadedCartItems((prevItems) =>
      prevItems.filter((item) => item.dishId._id !== deletedIngredientId)
    );
    await fetchTableCart();
    navigate(`/tables/${tableId}`);
  };

  const updateCartHandler = () => {
    fetchTableCart();
  };

  const onAddOrder = () => {
    setShowConfirmModal(true);
    setOrderNote(""); // Clear note after successful order
  };

  const categoryChangeHandler = (event) => {
    setSelectedCategory(event.target.value);
  };

  const nameChangeHandler = (event) => {
    setInputName(event.target.value);
  };

  const noteChangeHandler = (event) => {
    setOrderNote(event.target.value);
  };

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
        <p>Operacja przebiegła pomyślnie</p>
      </Modal>
      <h1 className="text3">Numer stolika: {tableId}</h1>
      <ErrorModal error={error} onClear={clearError} />
      {loadedCartItems && (
        <DishCartList
          cartItems={loadedCartItems}
          tableId={tableId}
          onDelete={cartItemsDeletedHandler}
          onAddDish={updateCartHandler}
          onAddOrder={onAddOrder}
          onCancelModal={cancelDeleteHandler}
          orderNote={orderNote}
        />
      )}
      <div className="search-container">
        <form className="search-forms">
          <div className="select-category">
            <label htmlFor="name">Nazwa:</label>
            <input
              className="select"
              type="text"
              id="name"
              value={inputName}
              onChange={nameChangeHandler}
            />
          </div>
          <div className="select-category">
            <label htmlFor="category">Kategoria:</label>
            <select
              className="select"
              id="category"
              value={selectedCategory}
              onChange={categoryChangeHandler}
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="select-category" >
            <label htmlFor="order-note">Notatka do zamówienia:</label>
            <input
              style={{backgroundColor: 'white', border: 'none', color: 'black'}}
              className="select"
              id="order-note"
              value={orderNote}
              onChange={noteChangeHandler}
              rows="3"
              maxLength="500"
            />
          </div>
        </form>
      </div>

      {dishesByCategory &&
        Object.keys(dishesByCategory).map((category) => (
          <div key={category} className="category-section">
            <h2 className="text4">{category}</h2>
            <DishList
              items={dishesByCategory[category]}
              tableId={tableId}
              onAddDish={updateCartHandler}
            />
          </div>
        ))}
    </>
  );
};

export default Dishes;