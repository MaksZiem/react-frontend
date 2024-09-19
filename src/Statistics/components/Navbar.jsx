// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Opcjonalnie, aby dodać style

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
      <li className="navbar-item">
          <Link to="/orders">Zamówienia</Link>
        </li>
        <li className="navbar-item">
          <Link to="/customers">Klienci</Link>
        </li>
        <li className="navbar-item">
          <Link to="/dishes">Dania</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
