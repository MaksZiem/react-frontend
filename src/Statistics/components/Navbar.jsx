
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
      <li className="navbar-item">
          <Link to="/statistics">Zamówienia</Link>
        </li>
        {/* <li className="navbar-item">
          <Link to="/customers">Klienci</Link>
        </li> */}
        <li className="navbar-item">
          <Link to="/statistics/dishes">Dania</Link>
        </li>
        <li className="navbar-item">
          <Link to="/statistics/all-cooks">Pracownicy</Link>
        </li>
        <li className="navbar-item">
          <Link to="/statistics/ingredients">Skladniki</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
