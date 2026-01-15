export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // 1️⃣ City → Lat/Lon (OpenStreetMap)
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`,
      {
        headers: { 'User-Agent': 'weather-zmanim-app' },
      }
    );

    if (!geoRes.ok) throw new Error('Geocoding failed');

    const geoData = await geoRes.json();
    if (!geoData.length) throw new Error('City not found');

    const { lat, lon, display_name } = geoData[0];

    // 2️⃣ Zmanim (Hebcal handles timezone automatically)
    const zmanimRes = await fetch(
      `https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${lon}`
    );

    if (!zmanimRes.ok) throw new Error('Hebcal request failed');

    const zmanimData = await zmanimRes.json();
    if (!zmanimData.times) throw new Error('No zmanim returned');

    res.status(200).json({
      city: display_name,
      times: zmanimData.times,
    });
  } catch (err) {
    console.error('Zmanim API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch zmanim' });
  }
}