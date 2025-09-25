import React, {useContext} from 'react'
import { NavLink } from 'react-router-dom'

import { AuthContext } from '../../context/auth-context'
import './NavLinks.css'

const NavLinks = () => {
    const auth = useContext(AuthContext)
    return (
        <ul className='nav-links'>
            {auth.isLoggedIn && auth.userRole === 'admin' && (
            <li>
                <NavLink to="/magazine" exact>magazyn</NavLink>
            </li>
            )}
            {auth.isLoggedIn &&  (auth.userRole === 'admin') && (
            <li>
                <NavLink to="/ingredients-dashboard" exact>tworzenie dania</NavLink>
            </li>
            )}
            {auth.isLoggedIn &&  (auth.userRole === 'admin' || auth.userRole === "waiter") && (
            <li>
                <NavLink to="/tables" exact>przyjmowanie zamówien</NavLink>
            </li>
            )}
            {auth.isLoggedIn && (auth.userRole === 'admin' || auth.userRole === "waiter") && (
            <li>
                <NavLink to="/ready-dishes" exact>dania do odbioru</NavLink>
            </li>
            )}
            {auth.isLoggedIn && (auth.userRole === 'admin' || auth.userRole === "cook") && (
            <li>
                <NavLink to="/cook" exact>nowe zamówienia</NavLink>
            </li>
            )}
            {auth.isLoggedIn && auth.userRole === "cook" && (
            <li>
                <NavLink to="/statistics/cooks/details" exact>statystyki kucharza</NavLink>
            </li>
            )} 
            {auth.isLoggedIn  && (
            <li>
                <NavLink to="/update-user" exact>edycja danych osobowych</NavLink>
            </li>
            )} 
            {auth.isLoggedIn && (auth.userRole === 'admin') && (
            <li>
                <NavLink to="/statistics" exact>statystyki</NavLink>
            </li>
            )}
            {auth.isLoggedIn && (auth.userRole === 'admin') && (
            <li>
                <NavLink to="/config" exact>ustawienia</NavLink>
            </li>
            )}
            {/* {auth.isLoggedIn && (auth.userRole === 'kelner' || auth.userRole === "waiter") && (
            <li>
                <NavLink to="/waiter-statistics" exact>statystyki kelnera</NavLink>
            </li>
            )} */}
            {!auth.isLoggedIn && (
            <li>
              <NavLink to="/">Autoryzacja</NavLink>  
            </li>
            )}
            {auth.isLoggedIn && (
            <li>
                <NavLink to="/" onClick={auth.logout}>wyloguj</NavLink>
            </li>
            )}
        </ul>
    )
}

export default NavLinks
