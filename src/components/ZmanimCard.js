import { useState } from 'react';

function ZmanimCard() {
  const [city, setCity] = useState('Brooklyn');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchZmanim = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/zmanim?city=${encodeURIComponent(city)}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to load zmanim');
      }

      setData(json);
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
      timeZone: data.timezone, // ✅ CITY TIMEZONE
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

      {data && (
        <>
          <h3>{data.city}</h3>
          <p><strong>Timezone:</strong> {data.timezone}</p>

          <table>
            <tbody>
              <tr><td>Alot Hashachar</td><td>{formatTime(data.times.alotHaShachar)}</td></tr>
              <tr><td>Sunrise</td><td>{formatTime(data.times.sunrise)}</td></tr>
              <tr><td>Latest Shema</td><td>{formatTime(data.times.sofZmanShma)}</td></tr>
              <tr><td>Latest Tefillah</td><td>{formatTime(data.times.sofZmanTfilla)}</td></tr>
              <tr><td>Chatzot</td><td>{formatTime(data.times.chatzot)}</td></tr>
              <tr><td>Mincha Gedola</td><td>{formatTime(data.times.minchaGedola)}</td></tr>
              <tr><td>Plag HaMincha</td><td>{formatTime(data.times.plagHaMincha)}</td></tr>
              <tr><td>Sunset</td><td>{formatTime(data.times.sunset)}</td></tr>
              <tr><td>Nightfall (Tzeit)</td><td>{formatTime(data.times.tzeit)}</td></tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default ZmanimCard;