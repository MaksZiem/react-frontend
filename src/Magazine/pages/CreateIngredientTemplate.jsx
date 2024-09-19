import React, { useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const CreateIngredientTemplate = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, setFormState] = useState({
    name: '',
    category: '',
    expirationDate: '' // Pole do przechowywania daty
  });

  const handleInputChange = event => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    });
  };

  const ingredientSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        'http://localhost:5000/api/magazine/create-ingredient-template',
        'POST',
        JSON.stringify({
          name: formState.name,
          category: formState.category,
          expirationDate: formState.expirationDate, // Przekazujemy datę w formacie YYYY-MM-DD
        }),
        { 'Content-Type': 'application/json' }
      );
      // Reset form po sukcesie
      setFormState({ name: '', category: '', expirationDate: '' });
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <form onSubmit={ingredientSubmitHandler}>
        <label>Nazwa:</label>
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={handleInputChange}
        />
        <label>Kategoria:</label>
        <input
          type="text"
          name="category"
          value={formState.category}
          onChange={handleInputChange}
        />
        <label>Data wygaśnięcia:</label>
        <input
          type="date"
          name="expirationDate"
          value={formState.expirationDate}
          onChange={handleInputChange}  // Obsługujemy zmianę daty
        />
        <button type="submit">Dodaj składnik</button>
      </form>
    </>
  );
};

export default CreateIngredientTemplate;
