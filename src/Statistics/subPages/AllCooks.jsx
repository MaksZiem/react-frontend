import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import "./AllCooks.css";
import Employes from "../pages/Employes";
import { BarChart } from "@mui/x-charts";
import { URL } from "../../shared/consts";

const AllCooksStats = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [cooks, setCooks] = useState([]);
  const [cookStats, setCookStats] = useState(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const colors = ["#FF6347", "#FFD700", "#ADFF2F", "#20B2AA"]; // Paleta kolorów dla kucharzy

  useEffect(() => {
    const fetchCooks = async () => {
      try {
        const responseData = await sendRequest(
          `${URL}/api/statistics/cooks`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        console.log(responseData);
        setCooks(responseData.users);
      } catch (err) {}
    };
    fetchCooks();
  }, [sendRequest, auth.token]);

  useEffect(() => {
    const fetchCookStats = async () => {
      try {
        const responseData = await sendRequest(
          `${URL}/api/statistics/all-cooks-stats`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        setCookStats(responseData);
        console.log(responseData);
      } catch (err) {}
    };
    fetchCookStats();
  }, [sendRequest, auth.token]);

  const totalDishes = cookStats
    ? cookStats.cookRanking.reduce((sum, cook) => sum + cook.dishCount, 0)
    : [];

  // 2. Przetwórz dane do formatu dla PieChart
  const cookData = cookStats
    ? cookStats.cookRanking.map((cook, index) => ({
        id: index,
        label: cook.cookName,
        value: ((cook.dishCount / totalDishes) * 100).toFixed(2), // procentowy udział
      }))
    : [];

  const labels = cookStats
    ? cookStats.cookRanking.map((cook) => cook.cookName)
    : [];

  const data = cookStats
    ? cookStats.cookRanking.map((cook) => cook.dishCount)
    : [];

  const handleCookClick = (cookId) => {
    navigate(`/statistics/cooks/details`, {
      state: { cookId: cookId },
    });
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

  const initialColor = "rgb(117, 148, 215)";
  const steps = 10;
  const result = darkenColor(initialColor, steps);

  return (
    <>
      <div className="container-statistics">
        <Navbar />
        <div className="content">
          <Employes tab={"cook"} />
          <ErrorModal error={error} onClear={clearError} />
          {isLoading && (
            <div className="spinner">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && cookStats && (
            <div className="cook-stats-details">
              <h2 className="text2">Ogólne statystyki przygotowanych dań</h2>
              <div className="dishes-counts">
                <div className="dishes-counts-item">
                  <div className="count">{cookStats.counts.today}</div>
                  <div className="date">dzisiaj</div>
                </div>
                <div className="dishes-counts-item">
                  <div className="count">{cookStats.counts.lastWeek}</div>
                  <div className="date">ostatni tydzien</div>
                </div>
                <div className="dishes-counts-item">
                  <div className="count">{cookStats.counts.lastMonth}</div>
                  <div className="date">ostatni miesiąc</div>
                </div>
                <div className="dishes-counts-item">
                  <div className="count">{cookStats.counts.lastYear}</div>
                  <div className="date">ostatni rok</div>
                </div>
              </div>

              <h2 className="text2">
                Ranking kucharzy według liczby przygotowanych dań
              </h2>
              <div className="cooks-charts">
                <div className="cook-chart-statistics">
                  <h2 className="text">udział we wszystkich daniach</h2>
                  <PieChart
                    colors={result}
                    series={[
                      {
                        data: cookData,
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
                <div className="cook-chart-statistics">
                  <h2 className="text">liczby wykonanych dan</h2>
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: labels, // 7 dni tygodnia

                        legend: {
                          text: {
                            fill: "white",
                          },
                        },
                        ticks: {
                          line: {
                            stroke: "white",
                            strokeWidth: 1,
                          },
                          text: {
                            fill: "white",
                          },
                        },
                      },
                    ]}
                    series={[
                      {
                        data: data,
                        // data: [1,2,3,4,56,7,7],
                        color: "rgb(117, 148, 215)",
                      }, // Kolor i dane dla kolumn
                    ]}
                    colors={{ scheme: "nivo" }}
                    width={600}
                    height={300}
                  />
                </div>
              </div>
            </div>
          )}

          <h1 className="text">Lista kucharzy</h1>
          <div className="place-list-form-placeholder-ingredient">
            <div className="cook-list-desc">
              <div className="cook-image">zdjecie</div>
              <span className="cook-name">imię</span>
              <span className="cook-surname">nazwisko</span>
              <span className="cook-pesel">pesel</span>
              <span className="cook-action">akcje</span>
            </div>
          </div>
          {!isLoading && cooks.length > 0 && (
            <ul className="list-form-cooks">
              {cooks.map((cook, index) => (
                <li
                  key={cook.id}
                  onClick={() => handleCookClick(cook._id)}
                  className={
                    index === cooks.length - 1
                      ? "last-cook"
                      : "cook-list-item"
                  }
                >
                  <div className="cook-image">
                    <img
                      className="image"
                      src={`${URL}/uploads/images/${cook.image}`}
                      alt={cook.name}
                    />
                  </div>
                  <span className="cook-name">{cook.name}</span>
                  <span className="cook-surname">{cook.surname}</span>
                  <span className="cook-pesel">{cook.pesel}</span>
                  <div className="cook-action">
                    <button
                      type="button"
                      className="ingredient-details-button4"
                      onClick={() => handleCookClick(cook._id)}
                    >
                      Szczegóły
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default AllCooksStats;
