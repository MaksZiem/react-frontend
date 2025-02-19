import React, { useContext, useState } from "react";
import { URL } from "../../shared/consts";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      role: {
        value: "",
        isValid: true,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
          surname: { value: "", isValid: false },
          pesel: { value: "", isValid: false },
          role: { value: "admin", isValid: true },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/auth/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(
          responseData.userId,
          responseData.token,
          responseData.userRole
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("surname", formState.inputs.surname.value);
        formData.append("pesel", formState.inputs.pesel.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("role", formState.inputs.role.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          `http://localhost:8000/api/auth/signup`,
          "POST",
          formData
        );

        auth.login(
          responseData.userId,
          responseData.token,
          responseData.userRole
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Logowanie</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <>
              <Input
                element="input"
                id="name"
                type="text"
                label="Imię"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Imie jest wymagane."
                onInput={inputHandler}
              />
              <Input
                element="input"
                id="surname"
                type="text"
                label="Nazwisko"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Nazwisko jest wymagane."
                onInput={inputHandler}
              />
              <Input
                element="input"
                id="pesel"
                type="text"
                label="Pesel"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Pesel jest wymagany."
                onInput={inputHandler}
              />
              <ImageUpload center id="image" onInput={inputHandler} />
            </>
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Podaj email o odpowiednim formacie"
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Hasło"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Haslo musi zawierac conajmniej 6 znaków."
            onInput={inputHandler}
          />
          {!isLoginMode && (
            <div className="form-control">
              <label htmlFor="role">Wybierz role</label>
              <select
                id="role"
                onChange={(e) => inputHandler("role", e.target.value, true)}
                value={formState.inputs.role.value}
                className="select-dropdown"
              >
                <option value="admin">Administrator</option>
                <option value="waiter">Kelner</option>
                <option value="cook">Kucharz</option>
              </select>
            </div>
          )}
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "Zaloguj" : "Zarejestruj"}
          </Button>
        </form>

        <button inverse onClick={switchModeHandler} className="logreg">
          {isLoginMode ? "Rejestracja" : "Logowanie"}
        </button>
      </Card>
    </>
  );
};

export default Auth;
