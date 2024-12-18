import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./CreateIngredientTemplate.css";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Modal from "../../shared/components/UIElements/Modal";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";

const CreateIngredientTemplate = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      category: {
        value: "",
        isValid: false,
      },
      expirationDate: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
    },
    false
  );


  // useEffect(()=> {
  //   console.log(formState)
  // }, [formState])

  const ingredientSubmitHandler = async (event) => {
    event.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("category", formState.inputs.category.value);
      formData.append(
        "expirationDate",
        formState.inputs.expirationDate.value
      );
      formData.append("image", formState.inputs.image.value);
      // console.log(formData);
      await sendRequest(
        "http://localhost:8000/api/magazine/create-ingredient-template",
        "POST",
        formData,
        // { 'Content-Type': 'application/json' }
      );
      // Reset form po sukcesie
      // setFormState({ name: '', category: '', expirationDate: '' });
      setShowConfirmModal(true);
      setFormData(
        {
          name: { value: '', isValid: false },
          category: { value: '', isValid: false },
          expirationDate: { value: '', isValid: false },
          image: { value: '', isValid: false }
        },
        false
      );
    } catch (err) {
      console.log(err)
    }
  };

  const cancelDeleteHandler = () => {
    
    setShowConfirmModal(false);
    navigate('/magazine')
  };


  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Aktualizacja"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            
            <Button danger onClick={cancelDeleteHandler}>
              dodano
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Zaktualizowano dane uzytkownika
        </p>
      </Modal>
      {isLoading && <LoadingSpinner asOverlay />}
      <Card className="authentication">
      <h2>Dodawanie składnika</h2>
      <hr />
      <form onSubmit={ingredientSubmitHandler}>
        <Input
          id="name"
          element="input"
          type="text"
          label="name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
          />
        <Input
          id="category"
          element="input"
          type="text"
          label="category"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
          />
        <Input
          id="expirationDate"
          element="input"
          type="date"
          label="expirationDate"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
          />
        <ImageUpload
          center
          id="image"
          onInput={inputHandler}
          onErrorText="Dodaj zdjecie"
          />
        <Button  type="submit" disabled={!formState.isValid}>Dodaj składnik</Button>
      </form>
      </Card>
    </>
  );
};

export default CreateIngredientTemplate;
