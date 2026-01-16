import { useState, useEffect } from 'react';
import { HDate } from '@hebcal/core';
import './Card.css';

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [hebrewDate, setHebrewDate] = useState('');

  const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

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
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`
      );

      if (!res.ok) throw new Error('City not found');

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="left">
        <h2>🌤️ Weather</h2>
        <p className="subtle">📅 {hebrewDate}</p>

        <form
          className="input-row"
          onSubmit={(e) => {
            e.preventDefault();
            fetchWeather();
          }}
        >
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading…' : 'Search'}
          </button>
        </form>

        {error && <p className="error">❌ {error}</p>}
      </div>

      <div className="right">
        {loading && <p className="subtle">Loading weather…</p>}

        {!loading && !weather && !error && (
          <p className="subtle">➡️ Search for a city to see the weather</p>
        )}

        {weather && (
          <>
            <h3>{weather.name}</h3>

            <img
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />

            <div className="grid">
              <div className="weather-row">
                <span>Temp</span>
                <span>{Math.round(weather.main.temp)}°F</span>
              </div>
              <div className="weather-row">
                <span>Feels</span>
                <span>{Math.round(weather.main.feels_like)}°F</span>
              </div>
              <div className="weather-row">
                <span>Humidity</span>
                <span>{weather.main.humidity}%</span>
              </div>
              <div className="weather-row">
                <span>Wind</span>
                <span>{Math.round(weather.wind.speed)} mph</span>
              </div>
            </div>

            <p className="conditions">{weather.weather[0].description}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default WeatherCard;