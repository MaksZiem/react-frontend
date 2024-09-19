import React, { useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './Tables.css';
import Card from '../../shared/components/UIElements/Card';

const TablesList = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [tables, setTables] = useState([]);
  const [tips, setTips] = useState({});
  const [addTip, setAddTip] = useState(true)
  const [addOrder, setAddOrder] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/dishes/tables');
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
        'http://localhost:5000/api/dishes/add-tip',
        'POST',
        JSON.stringify({
          amount: tipAmount,
          orderId: orderId,
          // addedDate: Date.now()
        }),
        { 'Content-Type': 'application/json' }
      );
      setAddTip(false)
      setAddOrder(false)
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
          {/* <Card className='place-item__content'> */}
          {tables.map((table) => (
            <li key={table._id} className={`table-item ${addOrder === false ? 'table-free' : getStatusClass(table.status)}`}>
              <span>Numer stolika: {table.number}</span>
              {table.order && (
                <>
                {/* <span>Order ID: {table.order._id}</span> */}
              <span>Cena całkowita: {table.order.price} zł</span>    
                {/* <div> */}

                  {/* Wyświetlanie dań w zamówieniu */}
                  {/* <h4>Dishes:</h4> */}
                  <span>Dania:</span>
                  {table.order.dishes && addOrder && table.order.dishes.length > 0 ? (
                    <ul className='item-list'>
                      
                      {table.order.dishes.map((dishItem) => (
                        <li key={dishItem._id}>
                          <span className='table-dishes'>{dishItem.dish.name} (x{dishItem.quantity}) -{' '}</span>
                          <span className='table-dishes'>{dishItem.dish.price * dishItem.quantity} zł</span>
                        </li>
                      ))}
                     
                    </ul>
                  ) : (
                    <p>No dishes found.</p>
                  )}

                  {/* Obsługa napiwków dla zamówienia */}
                  {table.status === 'delivered' && addTip && (
                    <>
                      <input
                      className='select3'
                        type="number"
                        placeholder="Napiwek"
                        value={tips[table.order._id] || ''}
                        onChange={(e) => handleTipChange(table.order._id, e.target.value)}
                      />
                      <button className="submit-button3" onClick={() => submitTipHandler(table.order._id)}>
                        Dodaj napiwek
                      </button>
                    </>
                  )}
                {/* </div> */}
                </>
              )}
              <button className="submit-button3" onClick={() => viewTableDetailsHandler(table.number)}>
                {table.status === 'free' ? "Dodaj zamówienie" : "Szczegóły"}
              </button>
              <span className='status'>Status: {table.status}</span>
            </li>
          ))}
          {/* </Card> */}
          
        </ul>
      )}
    </>
  );
};

export default TablesList;
