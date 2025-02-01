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
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";

const CreateIngredientTemplate = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      category: {
        value: "warzywo",
        isValid: true,
      },
      image: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(()=> {
    console.log(formState)
  }, [formState])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await sendRequest(
          'http://localhost:8000/api/config/ingredient-categories',
          'GET',
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(response.categories)
        setCategories(response.categories);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [sendRequest]);

  const ingredientSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("category", formState.inputs.category.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        "http://localhost:8000/api/magazine/create-ingredient-template",
        "POST",
        formData
      );
      setShowConfirmModal(true);
      setFormData(
        {
          name: { value: "", isValid: false },
          category: { value: "", isValid: false },
          image: { value: "", isValid: false },
        },
        false
      );
    } catch (err) {
      console.log(err);
    }
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
    navigate("/magazine");
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
            <Button onClick={cancelDeleteHandler}>Ok</Button>
          </React.Fragment>
        }
      >
        <p>Pomyślnie dodano składnik</p>
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
            label="Nazwa"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
          />
          <div className="form-control">
            <label htmlFor="category">Kategoria</label>
            <select
              id="category"
              onChange={(e) => inputHandler("category", e.target.value, true)}
              value={formState.inputs.category.value}
              className="select-dropdown"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <ImageUpload
            center
            id="image"
            onInput={inputHandler}
            onErrorText="Dodaj zdjecie"
          />
          <Button type="submit"  disabled={!formState.isValid}>
            Dodaj składnik
          </Button>
        </form>
      </Card>
    </>
  );
};

export default CreateIngredientTemplate;
