import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <h1>Panele statystyk</h1>
        <hr />
        <li className="navbar-item">
          <NavLink 
            to="/config" 
            className={({ isActive }) => isActive && window.location.pathname === '/config' ? 'active' : ''}
          >
            Edycja stołów
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink 
            to="/config/dish-category" 
            className={({ isActive }) => isActive && window.location.pathname === '/config/dish-category' ? 'active' : ''}
          >
            Kategorie dań
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink 
            to="/config/ingredient-category" 
            className={({ isActive }) => isActive && window.location.pathname === '/config/ingredient-category' ? 'active' : ''}
          >
            Kategorie składników
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink 
            to="/config/users" 
            className={({ isActive }) => isActive && window.location.pathname === '/config/users' ? 'active' : ''}
          >
            Pracownicy
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
