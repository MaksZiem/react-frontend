import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Button from '../../shared/components/FormElements/Button';
import './IngredientDetails.css'

const IngredientDetails = () => {
  const { name } = useParams(); // Pobranie nazwy składnika z URL
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [ingredients, setIngredients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    expirationDate: '',
    weight: '',
    price: ''
  });

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/magazine/${name}` // Twój endpoint backendowy
        );
        setIngredients(responseData.ingredients); // Przechowywanie danych w stanie
        if (responseData.ingredients.length > 0) {
          // Inicjalizacja formularza z pierwszym składnikiem (opcjonalnie)
          setFormData({
            name: responseData.ingredients[0].name,
            category: responseData.ingredients[0].category,
            expirationDate: '',
            weight: '',
            price: ''
          });
        }
      } catch (err) {}
    };
    fetchIngredients();
  }, [sendRequest, name]);

  // Obsługa zmiany wartości w formularzu
  const inputChangeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Obsługa przesyłania formularza
  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        'http://localhost:8000/api/magazine/add-ingredient', // Endpoint backendowy do dodania nowego składnika
        'POST',
        JSON.stringify({
          name: formData.name,
          category: formData.category,
          expirationDate: formData.expirationDate, // Data w formacie YYYY-MM-DD
          weight: formData.weight,
          price: formData.price
        }),
        { 'Content-Type': 'application/json' }
      );
      // Opcjonalnie: ponowne załadowanie składników po dodaniu nowego
      const responseData = await sendRequest(
        `http://localhost:8000/api/magazine/${name}`
      );
      setIngredients(responseData.ingredients);
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      
      {/* Wyświetlanie listy składników */}
      {!isLoading && ingredients.length > 0 && (
        <>
          <h1 className="text">Wybrane składniki</h1>
          <div className="place-list-form-placeholder">
            <div className="cart-item">
              <span className="item-name">Nazwa</span>
              <span className="item-category">Kategoria</span>
              <span className="item-weight">Ilość</span>
              <span className="item-action">Data ważności</span>
            </div>
          </div>
          <ul className="place-list-form">
            {ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                <div className="cart-item">
                  <span className="item-name">{ingredient.name}</span>
                  <span className="item-category">{ingredient.category}</span>
                  <span className="item-weight">{ingredient.weight}</span>
                  <span className="item-name">{ingredient.expirationDate}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      
      <div className="text2">
        <h2>Dodaj nową ilość do magazynu</h2>
      </div>
      <form className="add-dish-forms-container"  onSubmit={submitHandler}>
      <div  className="add-dish-forms2">
        <div className='select2-container' >
          <label htmlFor="name">Nazwa</label>
          <input
          className="select2"
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={inputChangeHandler}
            required
          />
        </div>
        <div className='select2-container'>
          <label htmlFor="category">Kategoria</label>
          <input
          className="select2"
            type="text"
            name="category"
            id="category"
            value={formData.category}
            onChange={inputChangeHandler}
            required
          />
        </div>
        <div className='select2-container' >
          <label htmlFor="expirationDate">Data ważności</label>
          <input
          className="select2"
            type="date"
            name="expirationDate"
            id="expirationDate"
            value={formData.expirationDate}
            onChange={inputChangeHandler}
            required
          />
        </div>
        <div className='select2-container'>
          <label htmlFor="weight">Ilość</label>
          <input
          className="select2"
            type="number"
            name="weight"
            id="weight"
            value={formData.weight}
            onChange={inputChangeHandler}
            required
          />
        </div>
        <div className='select2-container'>
          <label htmlFor="price">Cena</label>
          <input
          className="select2"
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={inputChangeHandler}
            required
          />
        </div>
        <div className='text2'> 
        <button type="submit" className="submit-button2">Dodaj składnik</button>
        </div>
      </div>
      </form>
      {!isLoading && ingredients.length === 0 && (
        <span>Brak składników do wyświetlenia.</span>
      )}
    </>
  );
};

export default IngredientDetails;
