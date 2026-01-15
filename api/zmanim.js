export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // 1️⃣ City → Lat/Lon (OpenStreetMap)
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`,
      { headers: { 'User-Agent': 'weather-zmanim-app' } }
    );

    if (!geoRes.ok) throw new Error('Geocoding failed');
    const geoData = await geoRes.json();
    if (!geoData.length) throw new Error('City not found');

    const { lat, lon, display_name } = geoData[0];

    // 2️⃣ Lat/Lon → Timezone (TimeZoneDB)
    const tzKey = process.env.TIMEZONEDB_KEY;
    if (!tzKey) throw new Error('Missing TIMEZONEDB_KEY');

    const tzRes = await fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?format=json&by=position&lat=${lat}&lng=${lon}&key=${tzKey}`
    );

    const tzData = await tzRes.json();
    if (!tzData.zoneName) throw new Error('Timezone lookup failed');

    // 3️⃣ Zmanim (Hebcal)
    const zmanimRes = await fetch(
      `https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${lon}&tzid=${tzData.zoneName}`
    );

    if (!zmanimRes.ok) throw new Error('Zmanim fetch failed');
    const zmanimData = await zmanimRes.json();
    if (!zmanimData.times) throw new Error('Invalid Zmanim response');

    res.status(200).json({
      city: display_name,
      timezone: tzData.zoneName,
      times: zmanimData.times,
    });
  } catch (err) {
    console.error('Zmanim error:', err.message);
    res.status(500).json({ error: err.message });
  }
}