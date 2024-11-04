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
import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";

const IngredientWeight = () => {
    const location = useLocation();
    const auth = useContext(AuthContext)
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
                'http://localhost:8000/api/ingredients/add-to-cart',
                'POST',
                JSON.stringify({
                    ingredientTemplateId: id,
                    weight: formState.inputs.weight.value,

                }),
                { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json'  } 
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
        <form className="add-dish-forms-container" onSubmit={ingredientSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="add-dish-forms">
            

        <Input
          id="weight"
          element="input"
          type="number"
          label="ilość (g)"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid weight."
          onInput={inputHandler}
          />
        
        <div className="text">

        <button className="weight-button"  type="submit" disabled={!formState.isValid}>
          Dodaj składnik
        </button>
        </div>
          </div>
        
      </form>
        </div>
        </div>
        </>
    );
};

export default IngredientWeight;
