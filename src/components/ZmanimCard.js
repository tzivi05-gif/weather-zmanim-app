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
      console.log("ZMANIM API RESPONSE:", data);

      if (!res.ok) throw new Error(data.error || 'Failed to fetch zmanim');
      if (!data.times) throw new Error('No zmanim returned');

      setZmanim(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return isNaN(d) ? '—' : d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="card">
      <div className="left">
        <h2>🕍 Zmanim</h2>

        <div className="input-row">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
          <button onClick={fetchZmanim} disabled={loading}>
            {loading ? 'Loading…' : 'Get Zmanim'}
          </button>
        </div>

        {error && <p className="error">❌ {error}</p>}
      </div>

      <div className="right">
        {zmanim && (
          <>
            <h3>{zmanim.location?.city || 'Location'}</h3>
            <p className="timezone">Timezone: {zmanim.location?.tzid}</p>

            <table className="zmanim-table">
              <tbody>
                <tr><td>Alot Hashachar</td><td>{formatTime(zmanim.times.alotHaShachar)}</td></tr>
                <tr><td>Sunrise</td><td>{formatTime(zmanim.times.sunrise)}</td></tr>
                <tr><td>Latest Shema</td><td>{formatTime(zmanim.times.sofZmanShma)}</td></tr>
                <tr><td>Latest Tefillah</td><td>{formatTime(zmanim.times.sofZmanTfilla)}</td></tr>
                <tr><td>Chatzot</td><td>{formatTime(zmanim.times.chatzot)}</td></tr>
                <tr><td>Mincha Gedola</td><td>{formatTime(zmanim.times.minchaGedola)}</td></tr>
                <tr><td>Plag HaMincha</td><td>{formatTime(zmanim.times.plagHaMincha)}</td></tr>
                <tr><td>Sunset</td><td>{formatTime(zmanim.times.sunset)}</td></tr>
                <tr><td>Nightfall (Tzeit)</td><td>{formatTime(zmanim.times.tzeit7083deg)}</td></tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default ZmanimCard;