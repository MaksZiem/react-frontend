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
            {auth.isLoggedIn && (
            <li>
                <NavLink to="/magazine" exact>magazyn</NavLink>
            </li>
            )}
            {auth.isLoggedIn && (
            <li>
                <NavLink to="/ingredients-dashboard" exact>tworzenie dania</NavLink>
            </li>
            )}
            {auth.isLoggedIn && (
            <li>
                <NavLink to="/tables" exact>przyjmowanie zamówien</NavLink>
            </li>
            )}
             {auth.isLoggedIn && (
            <li>
                <NavLink to="/ready-dishes" exact>dania do odbioru</NavLink>
            </li>
            )}
            {auth.isLoggedIn && (
            <li>
                <NavLink to="/cook" exact>kucharz</NavLink>
            </li>
            )}
            {/* {auth.isLoggedIn && (
            <li>
                <NavLink to="/dishes-dashboard" exact>dishes (order creator)</NavLink>
            </li>
            )} */}
            {auth.isLoggedIn && (
            <li>
                <NavLink to="/orders-dashboard" exact>orders</NavLink>
            </li>
            )}
            {auth.isLoggedIn && (
            <li>
                <NavLink to="/statistics" exact>statistics</NavLink>
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
