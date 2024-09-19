import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import './ingredientWeight.css'

const IngredientWeight = () => {
    const location = useLocation();
    const { name, category, id } = location.state || {}; // Fallback to empty object if no state is passed
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
            weight: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    const navigate = useNavigate();

    const ingredientSubmitHandler = async event => {
        event.preventDefault();
        console.log(formState.inputs.weight.value)
        try {
            await sendRequest(
                'http://localhost:5000/api/ingredients/add-to-cart',
                'POST',
                JSON.stringify({
                    ingredientTemplateId: id,
                    weight: formState.inputs.weight.value,

                }),
                { 'Content-Type': 'application/json' }
            );
            navigate('/ingredients-dashboard')
        } catch (err) { }
    };

    return (
        <>
        <ErrorModal error={error} onClear={clearError} />
        <div className="container">
            <div className="container2">
            <h1>Wprowadź ilość</h1>
            <h2>{name}</h2>
            {/* <h2>{category}</h2> */}
        <form className="place-form" onSubmit={ingredientSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="weight"
          element="input"
          type="number"
          label="ilość (g)"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid weight."
          onInput={inputHandler}
        />
        
        <button className="weight-button"  type="submit" disabled={!formState.isValid}>
          Dodaj składnik
        </button>
      </form>
        </div>
        </div>
        </>
    );
};

export default IngredientWeight;
