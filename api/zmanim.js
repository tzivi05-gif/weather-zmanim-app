export default async function handler(req, res) {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    // 1️⃣ City → Lat/Lon (OpenStreetMap)
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`;
    const geoRes = await fetch(geoUrl, {
      headers: { 'User-Agent': 'weather-zmanim-app' }
    });

    if (!geoRes.ok) throw new Error('Geocoding failed');

    const geoData = await geoRes.json();
    if (!geoData.length) throw new Error('City not found');

    const { lat, lon, display_name } = geoData[0];

    // 2️⃣ Hebcal Zmanim (Hebcal handles timezone automatically)
    const zmanimUrl = `https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${lon}`;
    const zmanimRes = await fetch(zmanimUrl);

    if (!zmanimRes.ok) throw new Error('Hebcal request failed');

    const zmanimData = await zmanimRes.json();
    if (!zmanimData.times) throw new Error('Zmanim missing');

    res.status(200).json({
      city: display_name,
      times: zmanimData.times
    });
  } catch (err) {
    console.error('Zmanim API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch zmanim' });
  }
}