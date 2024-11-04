import React, { useEffect, useState, useContext } from 'react';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Modal from '../../shared/components/UIElements/Modal';
import { useNavigate } from 'react-router-dom';

const UpdateUser = () => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const navigate = useNavigate();

  const [loadedUser, setLoadedUser] = useState();
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: { value: '', isValid: false },
      surname: { value: '', isValid: false },
      email: { value: '', isValid: false },
      pesel: { value: '', isValid: false }
    },
    false
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/auth/${userId}`
        );
        setLoadedUser(responseData.user);
        setFormData(
          {
            name: { value: responseData.user.name, isValid: true },
            surname: { value: responseData.user.surname, isValid: true },
            email: { value: responseData.user.email, isValid: true },
            pesel: { value: responseData.user.pesel, isValid: true }
          },
          true
        );
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userId, setFormData]);

  const userUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:8000/api/auth/${userId}`,
        'PATCH',
        JSON.stringify({
          name: formState.inputs.name.value,
          surname: formState.inputs.surname.value,
          email: formState.inputs.email.value,
          pesel: formState.inputs.pesel.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      setShowConfirmModal(true);
      
    } catch (err) {}
  };

  const cancelDeleteHandler = () => {
    
    setShowConfirmModal(false);
    navigate('/update-user')
  };


  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedUser && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find user!</h2>
        </Card>
      </div>
    );
  }

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
              ok
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Zaktualizowano dane uzytkownika
        </p>
      </Modal>
      {!isLoading && loadedUser && (
        <Card className="authentication">
            <h2>Zmiana danych osobowych</h2>
            <hr />
        <form className="user-profile-form" onSubmit={userUpdateSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedUser.name}
            initialValid={true}
          />
          <Input
            id="surname"
            element="input"
            type="text"
            label="Surname"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid surname."
            onInput={inputHandler}
            initialValue={loadedUser.surname}
            initialValid={true}
          />
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            onInput={inputHandler}
            initialValue={loadedUser.email}
            initialValid={true}
          />
          <Input
            id="pesel"
            element="input"
            type="text"
            label="PESEL"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid PESEL."
            onInput={inputHandler}
            initialValue={loadedUser.pesel}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PROFILE
          </Button>
        </form>
        </Card>
      )}
    </>
  );
};

export default UpdateUser;
