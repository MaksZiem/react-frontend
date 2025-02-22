import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./shared/context/auth-context";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Ingredients from "./Ingredients/pages/Ingredients";
import Dishes from "./Dishes/pages/Dishes";
import Auth from "./User/pages/Auth";
import IngredientWeight from "./Ingredients/pages/IngredientWeight";
import Magazine from "./Magazine/pages/Magazine";
import IngredientDetails from "./Magazine/pages/IngredientDetails";
import CreateIngredientTemplate from "./Magazine/pages/CreateIngredientTemplate";
import Tables from "./Dishes/pages/Tables";
import Cook from "./Dishes/pages/Cook";
import Statistics from "./Statistics/orderStatistics/OrderStatistics";
import ReadyDishes from "./Dishes/pages/ReadyDishes";
import WaiterStatistics from "./Statistics/subPages/EmpWaiterStats";
import CookStatistics from "./Cook/pages/OrdersCook";
import EmpCookStats from "./Statistics/subPages/EmpCookStats";
import DishStatistics from "./Statistics/subPages/DishStatistics";
import EmpWaiterStats from "./Statistics/subPages/EmpWaiterStats";
import DishesStatistics from "./Statistics/dishStatistics/DishesStatistics";
import Dish from "./Statistics/dishStatistics/Dish";
import UpdateUser from "./User/pages/UpdateUser";
import AllCooksStats from "./Statistics/subPages/AllCooks";
import AllWaiters from "./Statistics/subPages/AllWaiters";
import IngredientStatistics from "./Statistics/ingredientStatistics/pages/IngredientStatistics";
import IngredientStats from "./Statistics/ingredientStatistics/IngredientDetailsStatistics";
import OrdersWithDetails from "./Statistics/orderStatistics/OrdersWithDetails";
import Incomes from "./Statistics/incomes/pages/Incomes";
import EditDish from "./Statistics/dishStatistics/EditDish";
import IngredientUpdateWeight from "./Statistics/components/ingredientTemplate/IngredientWeight";
import TablesConfig from "./Config/pages/TablesConfig";
import IngredientCategoryConfig from "./Config/pages/IngredientCategoryConfig";
import DishCategoryConfig from "./Config/pages/DishCategoryConfig";
import UsersConfig from "./Config/pages/UsersConfig";
import DishHistory from "./Statistics/dishStatistics/DishHistory";
import Summary from "./Statistics/summary/Summary";
let logoutTimer;

const App = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uid, token, userRole, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setUserRole(userRole);
    const tokenExp =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExp);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        userRole: userRole,
        tokenExp: tokenExp.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUserRole(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    //czy data jest z przyszlosci
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.tokenExp) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.userRole,
        new Date(storedData.tokenExp)
      );
    }
  }, [login]);

  let routes;

  if (token) {
    routes = (
      <Routes>
        {/* <Route exact path="/" element={<Magazine />} /> */}
        <Route exact path="/" element={<Navigate to="/statistics" />} />
        <Route exact path="/ingredients-dashboard" element={<Ingredients />} />
        <Route path="/weight-checkout" element={<IngredientWeight />} />
        <Route exact path="/magazine" element={<Magazine />} />
        <Route path="/magazine/:name" element={<IngredientDetails />} />
        <Route
          path="/magazine/create-ingredient-template"
          element={<CreateIngredientTemplate />}
        />
        <Route path="/tables" element={<Tables />} />
        <Route path="/tables/:tableId" element={<Dishes />} />
        <Route path="/cook" element={<Cook />} />
        <Route path="/ready-dishes" element={<ReadyDishes />} />
        <Route path="/waiter-statistics" element={<WaiterStatistics />} />
        <Route path="/cook-statistics" element={<CookStatistics />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/statistics/dishes" element={<DishesStatistics />} />
        <Route
          path="/statistics/ingredients"
          element={<IngredientStatistics />}
        />
        <Route path="/statistics/dishes/dish" element={<Dish />} />
        <Route path="/statistics/dishes/history" element={<DishHistory />} />
        <Route
          path="/statistics/ingredients/ingredient"
          element={<IngredientStats />}
        />
        <Route path="/statistics/cooks/details" element={<EmpCookStats />} />
        <Route path="/statistics/waiter" element={<EmpWaiterStats />} />
        <Route path="/dish/stats" element={<DishStatistics />} />
        <Route path="/update-user" element={<UpdateUser />} />
        <Route path="/statistics/employes" element={<AllCooksStats />} />
        <Route path="/statistics/summary" element={<Summary />} />
        <Route path="/statistics/employes/waiters" element={<AllWaiters />} />
        <Route
          path="/statistics/orders/details"
          element={<OrdersWithDetails />}
        />
        <Route path="/statistics/incomes" element={<Incomes />} />
        <Route path="/statistics/cook/orders" element={<CookStatistics />} />
        <Route
          path="/statistics/dishes/update/:dishId"
          element={<EditDish />}
        />
        <Route
          path="/statistics/dishes/update/:dishId/weight-checkout"
          element={<IngredientUpdateWeight />}
        />
        <Route path="/config" element={<TablesConfig />} />
        <Route
          path="/config/ingredient-category"
          element={<IngredientCategoryConfig />}
        />
        <Route path="/config/dish-category" element={<DishCategoryConfig />} />
        <Route path="/config/users" element={<UsersConfig />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route exact path="/" element={<Auth />} />
        <Route exact path="/auth" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
        userId: userId,
        userRole: userRole,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
