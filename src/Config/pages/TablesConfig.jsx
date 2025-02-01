import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Navbar from "../componens/Navbar";
import "../componens/List.css";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";

const TablesConfig = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [tables, setTables] = useState([]);
  const auth = useContext(AuthContext);
  const [editingTable, setEditingTable] = useState(null); // Przechowuje stolik w edycji
  const [newNumber, setNewNumber] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // Pobierz stoliki
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:8000/api/config/tables",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setTables(responseData);
      } catch (err) {}
    };

    fetchTables();
  }, [sendRequest]);

  // Dodaj stolik
  const addTableHandler = async () => {
    try {
      const responseData = await sendRequest(
        "http://localhost:8000/api/config/tables",
        "POST",
        null,
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      setShowConfirmModal(true);
      setTables((prevTables) => [...prevTables, responseData.table]);
    } catch (err) {}
  };

  // Usuń stolik
  const deleteTableHandler = async (id) => {
    console.log(id);
    try {
      await sendRequest(
        `http://localhost:8000/api/config/tables/${id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      setTables((prevTables) => prevTables.filter((table) => table._id !== id));
      setShowDeleteModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  // Rozpocznij edycję stolika
  const startEditHandler = (table) => {
    setEditingTable(table);
    setNewNumber(table.number); // Ustaw obecny numer jako początkową wartość
  };

  // Anuluj edycję
  const cancelEditHandler = () => {
    setEditingTable(null);
    setNewNumber("");
  };

  // Zapisz zmiany w numerze stolika
  const saveEditHandler = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:8000/api/config/tables/${editingTable._id}`,
        "PUT",
        JSON.stringify({ newNumber }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setTables((prevTables) =>
        prevTables.map((table) =>
          table._id === editingTable._id ? responseData.table : table
        )
      );
      setShowConfirmModal(true);
      setEditingTable(null);
      setNewNumber("");
    } catch (err) {}
  };

  const showDeleteWarningHandler = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
    setShowDeleteModal(false);
  };

  return (
    <div>
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
      <Modal
        show={showDeleteModal}
        onCancel={cancelDeleteHandler}
        header="Czy napewno?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <button
              className={"modal-button-accept"}
              onClick={cancelDeleteHandler}
            >
              Anuluj
            </button>
            <button
              className={"modal-button-decline"}
              onClick={() => deleteTableHandler(selectedId)}
            >
              Usuń
            </button>
          </React.Fragment>
        }
      >
        <p>Czy na pewno chcesz usunąc składnik?</p>
      </Modal>
      <div className="container-statistics">
        <Navbar />
        <div className="statistics">
          <h1 className="text">Konfiguracja Stolika</h1>
          <div className="dish-config-list-form">
            <button
              onClick={addTableHandler}
              className="btn-white-submit-config"
            >
              Dodaj Stolik
            </button>
            <ul className="dish-config-list-form">
              {tables.map((table) => (
                <li key={table._id} className="cart-item-ingredient">
                  {editingTable && editingTable._id === table._id ? (
                    <>
                      <div className="item-column">
                        <input
                          className="config-input"
                          type="number"
                          value={newNumber}
                          onChange={(e) => setNewNumber(e.target.value)}
                        />
                      </div>
                      <div className="item-column">
                        <button
                          onClick={saveEditHandler}
                          className="ingredient-details-button8"
                        >
                          Zapisz
                        </button>
                      </div>
                      <div className="item-column">
                        <button
                          onClick={cancelEditHandler}
                          className="ingredient-details-button8"
                        >
                          Anuluj
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="item-column">
                        <span>Numer: {table.number}</span>
                      </div>
                      <div className="item-column">
                        <button
                          onClick={() => startEditHandler(table)}
                          className="ingredient-details-button8"
                        >
                          Edytuj
                        </button>
                      </div>
                      <div className="item-column">
                        <button
                          onClick={() => showDeleteWarningHandler(table._id)}
                          className="ingredient-details-button9"
                        >
                          Usuń
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablesConfig;
