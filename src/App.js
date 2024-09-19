import React, { useState, useCallback } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,

} from 'react-router-dom';
import { AuthContext } from './shared/context/auth-context';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import Ingredients from './Ingredients/pages/Ingredients';
import Dishes from './Dishes/pages/Dishes';
import Users from './User/pages/Users';
import Auth from './User/pages/Auth';
import IngredientWeight from './Ingredients/pages/IngredientWeight';
import Magazine from './Magazine/pages/Magazine';
import IngredientDetails from './Magazine/pages/IngredientDetails';
import CreateIngredientTemplate from './Magazine/pages/CreateIngredientTemplate';
import Tables from './Dishes/pages/Tables'
import Cook from './Dishes/pages/Cook';
import Statistics from './Statistics/pages/Statistics';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const login = useCallback(() => {
        setIsLoggedIn(true)
    }, [])

    const logout = useCallback(() => {
        setIsLoggedIn(false)
    }, [])

    let routes;

    if (isLoggedIn) {
        routes = (
            <Routes>
                <Route exact path='/' element={<Users />} />
                <Route exact path='/ingredients-dashboard' element={<Ingredients />} />
                {/* <Route exact path='/dishes-dashboard' element={<Dishes />} /> */}
                <Route path="/weight-checkout" element={<IngredientWeight />} />
                <Route exact path='/magazine' element={<Magazine />} />
                <Route path="/magazine/:name" element={<IngredientDetails />} />
                <Route path="/create-ingredient-template" element={<CreateIngredientTemplate />} />
                <Route path='/tables' element={<Tables />} />
                <Route path='/table-details/:tableId' element={<Dishes />} />
                <Route path='/cook' element={<Cook />} />
                <Route path='/statistics' element={<Statistics />} />
            </Routes>
        )
    } else {
        routes = (
            <Routes>
                <Route exact path='/' element={<Users />} />
                <Route exact path='/auth' element={<Auth />} />

            </Routes>
        )
    }

    return (
        <AuthContext.Provider
            value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
        >
            <Router>
                <MainNavigation />
                <main>{routes}</main>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;



