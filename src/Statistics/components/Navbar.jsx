import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <h1>Panele statystyk</h1>
        <hr />
        {/* <li className="navbar-item">
        <NavLink 
            to="/statistics/summary" 
            className={({ isActive }) => isActive && window.location.pathname === '/statistics/summary' ? 'active' : ''}
          >
            Podsumowanie
          </NavLink>
        </li> */}
        <li className="navbar-item">
        <NavLink 
            to="/statistics" 
            className={({ isActive }) => isActive && window.location.pathname === '/statistics' ? 'active' : ''}
          >
            Zamówienia
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink 
            to="/statistics/dishes" 
            className={({ isActive }) => isActive || window.location.pathname.startsWith('/statistics/dishes') ? 'active' : ''}
          >
            Dania
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink 
            to="/statistics/employes" 
            className={({ isActive }) => isActive || window.location.pathname.startsWith('/statistics/cooks') ? 'active' : ''}
          >
            Pracownicy
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink 
            to="/statistics/ingredients" 
            className={({ isActive }) => isActive || window.location.pathname.startsWith('/statistics/ingredients') ? 'active' : ''}
          >
            Składniki
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink 
            to="/statistics/incomes" 
            className={({ isActive }) => isActive || window.location.pathname.startsWith('/statistics/incomes') ? 'active' : ''}
          >
            Przychody
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
