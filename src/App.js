import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import Ingredients from './Ingredients/pages/Ingredients';
import Dishes from './Dishes/pages/Dishes2';




const App = () => {
    return (
        <Router>
            <MainNavigation />
            <main>
                <Routes>
                    <Route exact path='/ingredients-dashboard' element={<Ingredients />} />
                    <Route exact path='/dishes-dashboard' element={<Dishes />} />
                </Routes>
            </main>
        </Router>
    );
};

export default App;
