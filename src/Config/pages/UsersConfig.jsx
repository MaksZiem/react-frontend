import React, { useEffect, useContext, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useNavigate } from 'react-router-dom';
import Navbar from '../componens/Navbar';
import './UsersConfig.css'
import { URL } from '../../shared/consts';

const UsersConfig = () => {
  const [cooks, setCooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchCooks = async () => {
      try {
        const responseData = await sendRequest(
          `${URL}/api/auth/users?page=${currentPage}&limit=${itemsPerPage}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        setCooks(responseData.users);
        setTotalPages(responseData.pages);
      } catch (err) {}
    };
    fetchCooks();
  }, [sendRequest, auth.token, currentPage, itemsPerPage]);

  const handleCookClick = (cookId) => {
    navigate(`/update-user`, {
      state: { cookId: cookId },
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Resetuj stronę na pierwszą przy zmianie limitu
  };

  return (
    <>
      <div className="container-statistics">
        <Navbar />
        <div className="statistics">
          <h1 className="text">Lista kucharzy</h1>
          <div className="place-list-form-placeholder-ingredient">
            <div className="cook-list-desc">
              <div className="cook-image">zdjecie</div>
              <span className="cook-name">nazwa</span>
              <span className="cook-surname">kategoria</span>
              <span className="cook-pesel">pesel</span>
              <span className="cook-action">akcje</span>
            </div>
          </div>
          {!isLoading && cooks.length > 0 && (
            <ul className="list-form-cooks">
              {cooks.map((cook, index) => (
                <li
                  key={cook.id}
                  onClick={() => handleCookClick(cook._id)}
                  className={
                    index === cooks.length - 1
                      ? "last-ingredient"
                      : "cook-list-item"
                  }
                >
                  <div className="cook-image">
                    <img
                      className="image"
                      src={`${URL}/${cook.image}`}
                      alt={cook.name}
                    />
                  </div>
                  <span className="cook-name">{cook.name}</span>
                  <span className="cook-surname">{cook.surname}</span>
                  <span className="cook-pesel">{cook.pesel}</span>
                  <div className="cook-action">
                    <button
                      type="button"
                      className="ingredient-details-button4"
                      onClick={() => handleCookClick(cook._id)}
                    >
                      Szczegóły
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Poprzednia
            </button>
            <span>Strona {currentPage} z {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Następna
            </button>
          </div>
          <div className="items-per-page">
            <span>Elementy na stronę: </span>
            <button
              onClick={() => handleItemsPerPageChange(5)}
              className={itemsPerPage === 5 ? "active" : ""}
            >
              5
            </button>
            <button
              onClick={() => handleItemsPerPageChange(10)}
              className={itemsPerPage === 10 ? "active" : ""}
            >
              10
            </button>
            <button
              onClick={() => handleItemsPerPageChange(15)}
              className={itemsPerPage === 15 ? "active" : ""}
            >
              15
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersConfig;
