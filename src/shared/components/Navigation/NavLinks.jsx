import React, {useContext} from 'react'
import { NavLink } from 'react-router-dom'

import { AuthContext } from '../../context/auth-context'
import './NavLinks.css'

const NavLinks = () => {
    const auth = useContext(AuthContext)
    return (
        <ul className='nav-links'>
            {/* <li>
                <NavLink to="/" exact>all users</NavLink>
            </li> */}
            {auth.isLoggedIn && auth.userRole === 'admin' && (
            <li>
                <NavLink to="/magazine" exact>magazyn</NavLink>
            </li>
            )}
            {auth.isLoggedIn &&  (auth.userRole === 'admin' || auth.userRole === "waiter") && (
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
                <NavLink to="/cook" exact>kucharz</NavLink>
            </li>
            )}
            {auth.isLoggedIn && (auth.userRole === 'admin' || auth.userRole === "cook") && (
            <li>
                <NavLink to="/cook-statistics" exact>statystyki kucharza</NavLink>
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
            {auth.isLoggedIn && (auth.userRole === 'admin' || auth.userRole === "waiter") && (
            <li>
                <NavLink to="/waiter-statistics" exact>statystyki kelnera</NavLink>
            </li>
            )}
            {!auth.isLoggedIn && (
            <li>
              <NavLink to="/auth">Authenticate</NavLink>  
            </li>
            )}
            {auth.isLoggedIn && (
            <li>
                <button onClick={auth.logout}>logout</button>
            </li>
            )}
        </ul>
    )
}

export default NavLinks
