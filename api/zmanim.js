export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // 🌍 1) City → Lat/Lon (Geoapify)
    const geoKey = process.env.GEOAPIFY_KEY;
    if (!geoKey) throw new Error('Missing GEOAPIFY_KEY');

    const geoRes = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&limit=1&apiKey=${geoKey}`
    );

    const geoData = await geoRes.json();
    if (!geoData.features?.length) throw new Error('City not found');

    const place = geoData.features[0];
    const lat = place.properties.lat;
    const lon = place.properties.lon;
    const cityName = place.properties.formatted;

    // 🕒 2) Hebcal Zmanim — timezone AUTO by lat/lon
    const zmanimRes = await fetch(
      `https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${lon}`
    );

    const zmanimData = await zmanimRes.json();
    if (!zmanimData.times) throw new Error('Failed to fetch zmanim');

    res.status(200).json({
      city: cityName,
      times: zmanimData.times,
    });
  } catch (err) {
    console.error('Zmanim error:', err.message);
    res.status(500).json({ error: err.message });
  }
}