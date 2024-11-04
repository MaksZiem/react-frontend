import React, { useEffect, useState, useContext } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './Tables.css';
import { AuthContext } from '../../shared/context/auth-context';

const TablesList = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [tables, setTables] = useState([]);
  const [tips, setTips] = useState({});
  const [tipSubmittedTables, setTipSubmittedTables] = useState([]); 
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const responseData = await sendRequest('http://localhost:8000/api/waiter/tables');
        setTables(responseData.tables);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTables();
  }, [sendRequest]);

  const viewTableDetailsHandler = (tableNumber) => {
    navigate(`/table-details/${tableNumber}`);
  };

  const handleTipChange = (orderId, value) => {
    setTips((prevTips) => ({
      ...prevTips,
      [orderId]: value
    }));
  };

  const submitTipHandler = async (orderId) => {
    const tipAmount = tips[orderId] || 0;
    try {
      await sendRequest(
        'http://localhost:8000/api/waiter/add-tip',
        'POST',
        JSON.stringify({
          amount: tipAmount,
          orderId: orderId,
        }),
        { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
      );

      
      setTables((prevTables) =>
        prevTables.map((table) =>
          table.order && table.order._id === orderId
            ? { ...table, status: 'free', order: null } 
            : table
        )
      );

      
      setTipSubmittedTables((prevSubmitted) => [...prevSubmitted, orderId]);
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'free':
        return 'table-free';
      case 'waiting':
        return 'table-waiting';
      case 'delivered':
        return 'table-delivered';
      default:
        return '';
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && tables && (
        <ul className="tables-list">
          {tables.map((table) => (
            <li key={table._id} className={`table-item ${getStatusClass(table.status)}`}>
              <div className='table-number'>Numer stolika: {table.number}</div>
              {table.order && (
                <>
                  <span>Cena całkowita: {table.order.price} zł</span>
                  <span>Dania:</span>
                  {table.order.dishes && table.order.dishes.length > 0 ? (
                    <ul className="item-list">
                      {table.order.dishes.map((dishItem) => (
                        <li key={dishItem._id}>
                          <span className="table-dishes">{dishItem.dish.name} (x{dishItem.quantity}) -{' '}</span>
                          <span className="table-dishes">{dishItem.dish.price * dishItem.quantity} zł</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No dishes found.</p>
                  )}

                  {/* Formularz napiwku tylko dla zamówień, dla których nie dodano jeszcze napiwku */}
                  {table.status === 'delivered' && !tipSubmittedTables.includes(table.order._id) && (
                    <>
                      <input
                        className="select3"
                        type="number"
                        placeholder="Napiwek"
                        value={tips[table.order._id] || ''}
                        onChange={(e) => handleTipChange(table.order._id, e.target.value)}
                      />
                      <button className="add-order-table-button" onClick={() => submitTipHandler(table.order._id)}>
                        Dodaj napiwek
                      </button>
                    </>
                  )}
                </>
              )}
              <button className="add-order-table-button" onClick={() => viewTableDetailsHandler(table.number)}>
                {table.status === 'free' ? "Dodaj zamówienie" : "Szczegóły"}
              </button>
              <span className="status">Status: {table.status}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default TablesList;
