import React, { useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

const Dish = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [dishData, setDishData] = useState(null);
    const [dishLeftData, setDishLeftData] = useState(null);
    const [newPrice, setNewPrice] = useState(''); 
    const [dishesWeekDays, setDishesWeekDays] = useState()
    const location = useLocation();
    const { dishId } = location.state || {};
    const auth = useContext(AuthContext);
    const [customWeights, setCustomWeights] = useState({});
    const [simulationData, setSimulationData] = useState(null);
    let revenueData
    let ingredientsData 
    let profitMarginValue

    const prepareIngredientsData = (data) => {
        return Object.entries(data).map(([name, itemData], index) => ({
            id: index,
            value: parseFloat(itemData.percentage),
            label: name,
        }));
    };

    const prepareSimulationPieData = (data) => {
        const ingredients = prepareIngredientsData(data.ingredients);
        const profitMargin = {
            id: ingredients.length,
            value: parseFloat(data.profitMargin),
            label: "Marża zysku",
        };
        return [...ingredients, profitMargin];
    };

    
    
    function darkenColor(rgbColor, steps) {
        // Parse the input RGB color
        const rgbValues = rgbColor.match(/\d+/g).map(Number);
    
        const colors = [];
        const darkenFactor = 30; // How much to darken each step
    
        for (let i = 0; i < steps; i++) {
    
          const newR = Math.max(rgbValues[0] - i * darkenFactor, 0);
          const newG = Math.max(rgbValues[1] - i * darkenFactor, 0);
          const newB = Math.max(rgbValues[2] - i * darkenFactor, 0);
    
    
          const newColor = `rgb(${newR}, ${newG}, ${newB})`;
          colors.push(newColor);
        }
    
        return colors; // Zwracamy tablicę kolorów
      }
    
      const initialColor = "rgb(102, 102, 255)";
      const steps = 10;
      const result = darkenColor(initialColor, steps);

    useEffect(() => {
        const fetchDishData = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:8000/api/statistics/dish-costs/${dishId}`,
                    'GET'
                );

                setDishData(responseData);
            } catch (err) {}
        };

        const fetchDishLeftData = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:8000/api/statistics/dishes-left/${dishId}`,
                    'GET'
                );
                
                setDishLeftData(responseData);
            } catch (err) {}
        };

        const fetchDishWeekDays = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:8000/api/statistics/dish-week-days-stats/${dishId}`,
                    'GET'
                );
                
                setDishesWeekDays(responseData);
            } catch (err) {}
        };

        
        fetchDishWeekDays()
        fetchDishData();
        fetchDishLeftData();
        console.log(dishData)
        // revenueData = dishData ? dishData.dailyRevenue.map(day => parseFloat(day.revenue)) : [];
    }, [sendRequest, dishId]);

    // Pobieramy etykiety dni oraz przychody z `dailyRevenue`
    const labels = dishData ? dishData.dailyRevenue.map(day => day.dayName) : [];
     revenueData = dishData ? dishData.dailyRevenue.map(day => parseFloat(day.revenue)) : [];

    // Przekształcamy dane składników w `ingredientsData`
     ingredientsData = dishData
        ? Object.entries(dishData.ingredients).map(([name, data], index) => ({
            id: index,
            value: parseFloat(data.percentage),
            label: name,
        }))
        : [];

      // 2. Dodaj marżę zysku jako osobny wpis
      profitMarginValue = dishData ? parseFloat(dishData.profitMargin) : []
      ingredientsData.push({
        id: ingredientsData.length,
        value: profitMarginValue,
        label: "Marża zysku",
      })

    const weekDaysLabels = dishesWeekDays ? dishesWeekDays.popularity.map(item => item.day) : [];
    const weekDaysCounts = dishesWeekDays ? dishesWeekDays.popularity.map(item => item.count) : [];


    const handleWeightChange = (ingredient, value) => {
        setCustomWeights(prevWeights => ({
            ...prevWeights,
            [ingredient]: value
        }));
    };

    const handleNewPriceSubmit = async (event) => {
        event.preventDefault();
        // Wyślij zapytanie do serwera o symulację
        console.log('req: '+newPrice)
        console.log(customWeights)
        try {
            const responseData = await sendRequest(
                `http://localhost:8000/api/statistics/simulation/${dishId}`,
                'POST',
                JSON.stringify({
                    customWeights,
                    newPrice
                }),
                { 'Content-Type': 'application/json' }
            );
            console.log(responseData.dailyRevenue)
            setSimulationData(responseData); // Ustaw dane symulacji
        } catch (err) {}
    };

    const updateDish = async (event) => {
        event.preventDefault();
        console.log('req: ' + newPrice);
        console.log(customWeights);
        try {
            const responseData = await sendRequest(
                `http://localhost:8000/api/statistics/update-dish/${dishId}`,
                'PUT',
                JSON.stringify({
                    customWeights,
                    newPrice
                }),
                { 'Content-Type': 'application/json' }
            );
            console.log(responseData.message);
            // Możesz zaktualizować stan lub zaktualizować widok
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Informacje o daniu</h1>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}

            {!isLoading && dishData && (
                <div>
                    <h2>{dishData.dishName}</h2>
                    <p>Cena dania: {dishData.dishPrice} PLN</p>
                    <h3>Składniki:</h3>
                    <ul>
                        {Object.entries(dishData.ingredients).map(([ingredientName, ingredientData]) => (
                            <li key={ingredientName}>
                                <strong>{ingredientName}</strong> - Koszt: {ingredientData.cost} PLN, Procent ceny dania: {ingredientData.percentage}% {ingredientData.weightInDish}
                                <input
                                    type="number"
                                    placeholder="Nowa ilość"
                                    onChange={(event) => handleWeightChange(ingredientName, event.target.value)}
                                />
                            </li>
                        ))}
                    </ul>
                    <p>Marża zysku: {dishData.profitMargin}%</p>
                    <p>Łączny przychód w ostatnim tygodniu: {dishData.totalRevenueLastWeek} PLN</p>
                    <p>Łączna liczba zamówień w ostatnim tygodniu: {dishData.totalQuantityLastWeek}</p>
                    <h3>Przychody dzienne z ostatniego tygodnia:</h3>
                    <ul>
                        {dishData.dailyRevenue.map(dayData => (
                            <li key={dayData.day}>Dzień {dayData.day}: {dayData.revenue} PLN</li>
                        ))}
                    </ul>
                    <div className="pie-chart-statistics">
                    <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    // data: ["pon", "wt", "śr", "czw", "pt", "sob", "nie"], 
                    data: labels,
                   
                    legend: {
                      text: {
                        fill: 'white',
                      },
                    },
                    ticks: {
                      line: {
                        stroke: 'white',
                        strokeWidth: 1,
                      },
                      text: {
                        fill: 'white',
                      },
                    },
                  },
                ]}
                series={[
                  {
                    data: revenueData,
                    color: "rgb(100, 102, 255)",
                  }, // Kolor i dane dla kolumn
                ]}
                colors={{ scheme: "nivo" }}
                width={600}
                height={300}
                
              />
              </div>
              <div className="pie-chart-statistics">
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    // data: ["pon", "wt", "śr", "czw", "pt", "sob", "nie"], 
                    data: weekDaysLabels,
                   
                    legend: {
                      text: {
                        fill: 'white',
                      },
                    },
                    ticks: {
                      line: {
                        stroke: 'white',
                        strokeWidth: 1,
                      },
                      text: {
                        fill: 'white',
                      },
                    },
                  },
                ]}
                series={[
                  {
                    data: weekDaysCounts,
                    color: "rgb(100, 102, 255)",
                  }, // Kolor i dane dla kolumn
                ]}
                colors={{ scheme: "nivo" }}
                width={600}
                height={300}
                
              />
              </div>
               <div className="pie-chart-statistics">
               <PieChart
            colors={result}
            series={[
                {
                    data: ingredientsData,
                    arcLabel: (item) => `${item.value}%`,
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
        />
            </div>
                </div>
                
            )}

            {!isLoading && dishLeftData && (
                <div>
                    <h2>Stan dań</h2>
                    <p>Nazwa dania: {dishLeftData.dishName}</p>
                    <p>Maksymalna liczba dań możliwych do przygotowania: {dishLeftData.maxDishesPossible}</p>
                </div>
            )}

            <div>
            <div>
    <h2>Ustaw nową cenę dania</h2>
    <form onSubmit={handleNewPriceSubmit}>
        <input 
            type="number" 
            value={newPrice} 
            onChange={event => setNewPrice(event.target.value)} 
            placeholder="Wprowadź nową cenę" 
            required 
        />
        <button type="submit">Symulacja</button>
        <button type="button" onClick={updateDish}>Zaktualizuj składniki</button>
    </form>
</div>

        {/* <div>
            <h2>Aktualizuj składniki dania</h2>
            <button onClick={updateDish}>Zaktualizuj składniki</button>
        </div> */}
            </div>
            {simulationData && (
                <div>
                    <h3>Wyniki symulacji:</h3>
                    <p>Nazwa dania: {simulationData.dishName}</p>
                    <p>Cena dania: {simulationData.dishPrice} PLN</p>
                    <h3>Składniki:</h3>
                    <ul>
                        {Object.entries(simulationData.ingredients).map(([ingredientName, ingredientData]) => (
                            <li key={ingredientName}>
                                <strong>{ingredientName}</strong> - Koszt: {ingredientData.cost} PLN, Procent ceny dania: {ingredientData.percentage}%
                            </li>
                        ))}
                    </ul>
                    <p>Marża zysku: {simulationData.profitMargin}%</p>
                    <p>Łączny przychód w ostatnim tygodniu: {simulationData.totalRevenueLastWeek} PLN</p>
                    <div className="pie-chart-statistics">
                        <PieChart
                            colors={result}
                            series={[{
                                data: prepareSimulationPieData(simulationData),
                                arcLabel: (item) => `${item.value}%`,
                                arcLabelMinAngle: 35,
                                arcLabelRadius: "60%",
                                highlightScope: { fade: "global", highlight: "item" },
                                faded: {
                                    innerRadius: 30,
                                    additionalRadius: -30,
                                    color: "gray",
                                },
                            }]}
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
                        />
                    </div>
                </div>
            )}
         
        </div>
    );
};

export default Dish;
