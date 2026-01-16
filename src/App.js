import WeatherCard from './components/WeatherCard';
import ZmanimCard from './components/ZmanimCard';
import './App.css';

export default function App() {
  return (
    <div className="container">
      <header className="hero">
        <h1>🌤️ Weather & 🕍 Zmanim App</h1>
        <p>Get weather and Jewish prayer times for your location</p>
      </header>

      <WeatherCard />
      <ZmanimCard />
    </div>
  );
}