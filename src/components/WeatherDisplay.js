import React from 'react';
import './WeatherDisplay.css';

const WeatherDisplay = ({ data }) => {
  if (!data) return null;

  const {
    coord,
    main,
    weather,
    wind,
    name,
    sys,
    visibility,
    clouds,
    timezone,
  } = data;

  const weatherInfo = weather[0];
  const temperature = Math.round(main.temp);
  const feelsLike = Math.round(main.feels_like);
  const tempMin = main.temp_min ? Math.round(main.temp_min) : null;
  const tempMax = main.temp_max ? Math.round(main.temp_max) : null;
  const humidity = main.humidity;
  const pressure = main.pressure;
  const seaLevel = main.sea_level;
  const groundLevel = main.grnd_level;
  const windSpeed = wind.speed;
  const visibilityKm = visibility ? (visibility / 1000).toFixed(1) : null;
  const cloudsPercentage = clouds?.all;

  const getWeatherIconUrl = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTimezone = (timezoneOffset) => {
    if (timezoneOffset === undefined || timezoneOffset === null) return null;
    const hours = Math.abs(timezoneOffset / 3600);
    const sign = timezoneOffset >= 0 ? '+' : '-';
    return `UTC${sign}${hours}`;
  };

  return (
    <div className="weather-display">
      <div className="location">
        <h2>{name}</h2>
        {sys.country && <span className="country">{sys.country}</span>}
      </div>

      {coord && (
        <div className="coordinates">
          <span className="coord-item">Lat: {coord.lat.toFixed(4)}°</span>
          <span className="coord-item">Lon: {coord.lon.toFixed(4)}°</span>
        </div>
      )}

      <div className="weather-main">
        <div className="temperature-section">
          <img
            src={getWeatherIconUrl(weatherInfo.icon)}
            alt={weatherInfo.description}
            className="weather-icon"
          />
          <div className="temperature">{temperature}°C</div>
        </div>
        <div className="weather-description">
          {weatherInfo.main} - {weatherInfo.description}
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Feels like</span>
          <span className="detail-value">{feelsLike}°C</span>
        </div>
        {tempMin !== null && tempMax !== null && (
          <div className="detail-item">
            <span className="detail-label">Temp Range</span>
            <span className="detail-value">{tempMin}°C - {tempMax}°C</span>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{pressure} hPa</span>
        </div>
        {seaLevel && (
          <div className="detail-item">
            <span className="detail-label">Sea Level</span>
            <span className="detail-value">{seaLevel} hPa</span>
          </div>
        )}
        {groundLevel && (
          <div className="detail-item">
            <span className="detail-label">Ground Level</span>
            <span className="detail-value">{groundLevel} hPa</span>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">Wind Speed</span>
          <span className="detail-value">{windSpeed} m/s</span>
        </div>
        {visibilityKm && (
          <div className="detail-item">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">{visibilityKm} km</span>
          </div>
        )}
        {cloudsPercentage !== undefined && (
          <div className="detail-item">
            <span className="detail-label">Clouds</span>
            <span className="detail-value">{cloudsPercentage}%</span>
          </div>
        )}
        {sys.sunrise && (
          <div className="detail-item">
            <span className="detail-label">Sunrise</span>
            <span className="detail-value">{formatTime(sys.sunrise)}</span>
          </div>
        )}
        {sys.sunset && (
          <div className="detail-item">
            <span className="detail-label">Sunset</span>
            <span className="detail-value">{formatTime(sys.sunset)}</span>
          </div>
        )}
        {timezone !== undefined && timezone !== null && (
          <div className="detail-item">
            <span className="detail-label">Timezone</span>
            <span className="detail-value">{formatTimezone(timezone)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDisplay;

