import React from 'react'
import { NavLink } from 'react-router-dom'

import './NavLinks.css'

const NavLinks = () => {
    return (
        <ul className='nav-links'>
            <li>
                <NavLink to="/" exact>home</NavLink>
            </li>
            <li>
                <NavLink to="/ingredients-dashboard" exact>ingredients (dish creator)</NavLink>
            </li>
            <li>
                <NavLink to="/dishes-dashboard" exact>dishes (order creator)</NavLink>
            </li>
            <li>
                <NavLink to="/orders-dashboard" exact>orders</NavLink>
            </li>
            <li>
                <NavLink to="/statistics" exact>statistics</NavLink>
            </li>

        </ul>
    )
}

export default NavLinks
