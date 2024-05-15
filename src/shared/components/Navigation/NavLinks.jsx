import React from 'react'
import { NavLink } from 'react-router-dom'

import './NavLinks.css'

const NavLinks = () => {
    return (
        <ul className='nav-links'>
            <li>
                <NavLink to="/" exact>ALL USERS</NavLink>
            </li>
            <li>
                <NavLink to="/ingredients" exact>ingredients</NavLink>
            </li>
            <li>
                <NavLink to="/dishes" exact>dishes</NavLink>
            </li>
            <li>
                <NavLink to="/magazine" exact>magazine</NavLink>
            </li>
            <li>
                <NavLink to="/auth " exact>auth</NavLink>
            </li>

        </ul>
    )
}

export default NavLinks
