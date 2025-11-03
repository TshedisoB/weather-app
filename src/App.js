import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherDisplay from './components/WeatherDisplay';
import { getCurrentLocation, fetchWeatherData } from './services/weatherService';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeatherData = async () => {
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const location = await getCurrentLocation();
      const data = await fetchWeatherData(location.lat, location.lon);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <h1 className="app-title">Weather App</h1>
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading weather data...</p>
          </div>
        )}
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={loadWeatherData} className="refresh-button">
              Try Again
            </button>
          </div>
        )}
        {weatherData && !loading && !error && (
          <>
            <WeatherDisplay data={weatherData} />
            <button onClick={loadWeatherData} className="refresh-button">
              Refresh
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

