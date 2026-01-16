import { useState } from 'react';
import './Card.css';

function ZmanimCard() {
  const [city, setCity] = useState('Brooklyn');
  const [zmanim, setZmanim] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchZmanim = async () => {
    setLoading(true);
    setError('');
    setZmanim(null);

    try {
      const res = await fetch(`/api/zmanim?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch zmanim');

      setZmanim(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // ✅ CORRECT timezone formatting using Hebcal tzid
  const formatTime = (iso) => {
    if (!iso || !zmanim?.timezone) return '—';

    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: zmanim.timezone, // 🔥 THIS fixes timezone permanently
    });
  };

  return (
    <div className="card">
      <h2>🕍 Zmanim by City</h2>

      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter any city"
      />

      <button onClick={fetchZmanim} disabled={loading}>
        {loading ? 'Loading…' : 'Get Zmanim'}
      </button>

      {error && <p className="error">❌ {error}</p>}
      {loading && <p>Loading…</p>}

      {zmanim && (
        <>
          <h3>{zmanim.city}</h3>
          <p className="timezone">Timezone: {zmanim.timezone}</p>

          <table>
            <tbody>
              <tr><td>Alot Hashachar</td><td>{formatTime(zmanim.times.alotHaShachar)}</td></tr>
              <tr><td>Sunrise</td><td>{formatTime(zmanim.times.sunrise)}</td></tr>
              <tr><td>Latest Shema</td><td>{formatTime(zmanim.times.sofZmanShma)}</td></tr>
              <tr><td>Latest Tefillah</td><td>{formatTime(zmanim.times.sofZmanTfilla)}</td></tr>
              <tr><td>Chatzot</td><td>{formatTime(zmanim.times.chatzot)}</td></tr>
              <tr><td>Mincha Gedola</td><td>{formatTime(zmanim.times.minchaGedola)}</td></tr>
              <tr><td>Plag HaMincha</td><td>{formatTime(zmanim.times.plagHaMincha)}</td></tr>
              <tr><td>Sunset</td><td>{formatTime(zmanim.times.sunset)}</td></tr>
              <tr><td>Nightfall (Tzeit)</td><td>{formatTime(zmanim.times.tzeit)}</td></tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default ZmanimCard;