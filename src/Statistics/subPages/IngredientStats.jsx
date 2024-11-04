import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";


const IngredientStats = () => {
  const location = useLocation();
  const { ingredientName } = location.state || {};
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [ingredientStats, setIngredientStats] = useState(null);
  const [pieChartData, setPieChartData] = useState([]); 
  const auth = useContext(AuthContext);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/magazine/${ingredientName}` 
        );
        setIngredients(responseData.ingredients); 
      
      } catch (err) {}
    };
    fetchIngredients();
  }, [sendRequest, ingredientName]);

  useEffect(() => {
    const fetchIngredientStats = async () => {
      if (!ingredientName) return;

      try {
        
        const responseStats = await sendRequest(
          `http://localhost:8000/api/statistics/ingredient-waste/${ingredientName}`,
          "GET"
        );

        setIngredientStats(responseStats);

        
        const responseUsage = await sendRequest(
          `http://localhost:8000/api/statistics/ingredient-in-dishes/${ingredientName}`,
          "GET"
        );

        
        const ingredientUsage = responseUsage.ingredientUsage;
        const totalQuantity = Object.values(ingredientUsage).reduce(
          (sum, item) => sum + item.totalQuantity,
          0
        );

        const formattedData = Object.values(ingredientUsage).map(item => ({
          id: item.dishName, 
          label: item.dishName, 
          value: ((item.totalQuantity / totalQuantity) * 100).toFixed(2), 
        }));

        setPieChartData(formattedData); 
      } catch (err) {
        console.error(err);
      }
    };

    fetchIngredientStats();
  }, [sendRequest, ingredientName, auth.token]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && ingredientStats && (
        <div>
          <h2>Statystyki dla składnika: {ingredientName}</h2>
          <p>Średnie dzienne zużycie: {ingredientStats.averageDailyUsage}</p>
          <p>Dni do wyczerpania: {ingredientStats.daysUntilOutOfStock}</p>
          <p>Dni do wygaśnięcia: {ingredientStats.daysUntilExpiration}</p>
          <p>Prawdopodobieństwo marnotrawstwa: {ingredientStats.wasteProbability}%</p>
          <p>Wartość marnotrawstwa: {ingredientStats.wastedValue}</p>
          <p>Łączna waga składnika: {ingredientStats.totalWeightOfIngredient}</p>
          
          
          <h3>Użycie składnika w daniach</h3>
          <PieChart
            series={[
              {
                data: pieChartData,
                arcLabel: (item) => `${item.label}: ${item.value}%`,
                arcLabelMinAngle: 35,
                arcLabelRadius: "60%",
                highlightScope: { fade: "global", highlight: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            colors={["#FF6347", "#FFD700", "#ADFF2F", "#20B2AA"]} 
            sx={{
              "& .MuiChartsLegend-series text": {
                fontSize: "0.9em !important",
                fontWeight: "bold",
              },
              [`& .${pieArcLabelClasses.root}`]: {
                fontWeight: "bold",
                fill: "white",
              },
            }}
            height={250}
            width={500}
          />
        </div>
      )}
      {!isLoading && ingredients.length > 0 && (
        <>
          <h1 className="text">Wybrane składniki</h1>
          <div className="place-list-form-placeholder">
            <div className="cart-item">
              <span className="item-name">Nazwa</span>
              <span className="item-category">Kategoria</span>
              <span className="item-weight">Ilość</span>
              <span className="item-action">Data ważności</span>
            </div>
          </div>
          <ul className="place-list-form">
            {ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                <div className="cart-item">
                  <span className="item-name">{ingredient.name}</span>
                  <span className="item-category">{ingredient.category}</span>
                  <span className="item-weight">{ingredient.weight}</span>
                  <span className="item-name">{ingredient.expirationDate}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default IngredientStats;
