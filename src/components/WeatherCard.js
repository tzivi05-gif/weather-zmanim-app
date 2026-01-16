import { useState, useEffect } from 'react';
import { HDate } from '@hebcal/core';
import './Card.css';

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [hebrewDate, setHebrewDate] = useState('');

  const API_KEY = '41f002717e85cead697d31f90c3f09f2';

  useEffect(() => {
    const hd = new HDate();
    setHebrewDate(hd.toString());
  }, []);

  const fetchWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
      );
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🌤️ Weather</h2>
      <p className="subtle">📅 {hebrewDate}</p>

      <div className="input-row">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button onClick={fetchWeather} disabled={loading}>
          {loading ? 'Loading…' : 'Search'}
        </button>
      </div>

      {error && <p className="error">❌ {error}</p>}

      {weather && (
        <>
          <h3>{weather.name}</h3>

          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />

          <table className="zmanim-table">
            <tbody>
              <tr><td>Temp</td><td>{Math.round(weather.main.temp)}°F</td></tr>
              <tr><td>Feels Like</td><td>{Math.round(weather.main.feels_like)}°F</td></tr>
              <tr><td>Humidity</td><td>{weather.main.humidity}%</td></tr>
              <tr><td>Wind</td><td>{Math.round(weather.wind.speed)} mph</td></tr>
            </tbody>
          </table>

          <p className="conditions">{weather.weather[0].description}</p>
        </>
      )}
    </div>
  );
}

export default WeatherCard;