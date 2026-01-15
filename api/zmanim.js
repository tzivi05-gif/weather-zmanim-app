export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
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

    const hebcalUrl = `https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${lon}`;
    const zmanimRes = await fetch(hebcalUrl);
    const text = await zmanimRes.text(); // 👈 read raw text

    // Try to parse JSON manually
    let zmanimData;
    try {
      zmanimData = JSON.parse(text);
    } catch {
      console.error('Hebcal raw response:', text.slice(0, 300));
      throw new Error('Hebcal did not return JSON');
    }

    if (!zmanimData.times) throw new Error('No zmanim times returned');

    res.status(200).json({
      city: cityName,
      times: zmanimData.times,
    });
  } catch (err) {
    console.error('Zmanim error:', err.message);
    res.status(500).json({ error: err.message });
  }
}