import React, { useEffect, useState, useContext } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './Tables.css';
import { AuthContext } from '../../shared/context/auth-context';
import { io } from 'socket.io-client';
import { URL } from '../../shared/consts';

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
      const responseData = await sendRequest(`${URL}/api/waiter/tables`);
      setTables(responseData.tables);
    } catch (err) {
      console.log(err);
    }
  };
  fetchTables();

  const socket = io('http://localhost:8001', { transports: ['websocket'] });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  

  // Obsługa zmiany statusu stolika
  socket.on('tableStatusChanged', (updatedTable) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table._id === updatedTable.tableId
          ? { ...table, status: updatedTable.status }
          : table
      )
    );
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });

  return () => {
    socket.disconnect();
  };
}, [sendRequest]);

  const viewTableDetailsHandler = (tableNumber) => {
    navigate(`/tables/${tableNumber}`);
  };

  const handleTipChange = (orderId, value) => {
    setTips((prevTips) => ({
      ...prevTips,
      [orderId]: value
    }));
  };

  const submitTipHandler = async (orderId, tableNumber) => {
    const tipAmount = tips[orderId] || 0;
    console.log(tableNumber)
    try {
      await sendRequest(
        `${URL}/api/waiter/add-tip`,
        'POST',
        JSON.stringify({
          amount: tipAmount,
          orderId: orderId,
          tableNumber: tableNumber
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
        return 'wolny';
      case 'waiting':
        return 'oczekujący';
      case 'delivered':
        return 'dostarczony';
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
                  {table.status === 'delivered' && !tipSubmittedTables.includes(table.order._id) && (
                    <>
                      <input
                      style={{marginBottom: "10px"}}
                        className="select3"
                        type="number"
                        placeholder="Napiwek"
                        value={tips[table.order._id] || ''}
                        onChange={(e) => handleTipChange(table.order._id, e.target.value)}
                      />
                      <button className="add-order-table-button" style={{marginBottom: "10px"}} onClick={() => submitTipHandler(table.order._id, table.number)}>
                        Zakończ
                      </button>
                    </>
                  )}
                </>
              )}
              <button className="add-order-table-button" onClick={() => viewTableDetailsHandler(table.number)}>
                {table.status === 'free' ? "Dodaj zamówienie" : "Szczegóły"}
              </button>
              <span className="status">Status: {getStatusClass(table.status)}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default TablesList;
