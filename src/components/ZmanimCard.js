import { useState } from 'react';

function ZmanimCard() {
  const [city, setCity] = useState('Brooklyn');
  const [zmanim, setZmanim] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchZmanim = async () => {
    setError(null);
    setZmanim(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/zmanim?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load zmanim');
      }

      setZmanim({
        city: data.location.title,
        times: data.times,
      });
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const formatTime = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div style={{ border: '2px solid #673ab7', padding: 20, borderRadius: 8 }}>
      <h2>🕍 Zmanim by City</h2>

      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter any city"
        style={{ padding: 8, marginRight: 8 }}
      />

      <button onClick={fetchZmanim}>Get Zmanim</button>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {zmanim && (
        <>
          <h3>{zmanim.city}</h3>
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
              <tr><td>Nightfall</td><td>{formatTime(zmanim.times.tzeit)}</td></tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default ZmanimCard;